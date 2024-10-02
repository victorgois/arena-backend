import "reflect-metadata";
import { DataSource } from "typeorm";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { scrapeMatchesData, scrapeConcertsData } from "./scrape/index";
import { Match, Concert } from "./model";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { scheduleWhatsAppMessage, handleIncomingMessage } from "./whatsappBot";
import twilio from "twilio";
import dotenv from "dotenv";
import { startStandaloneServer } from "@apollo/server/standalone";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [Match, Concert],
  synchronize: true,
  logging: false,
});

async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server)
  );

  app.post(
    "/webhook",
    express.urlencoded({ extended: false }),
    async (req, res) => {
      const incomingMsg = req.body.Body;
      const fromNumber = req.body.From.replace("whatsapp:", "");

      const responseMsg = await handleIncomingMessage(incomingMsg, fromNumber);

      const twiml = new twilio.twiml.MessagingResponse();
      twiml.message(responseMsg);

      res.writeHead(200, { "Content-Type": "text/xml" });
      res.end(twiml.toString());
    }
  );

  const { url } = await startStandaloneServer(server, {
    listen: { port: Number(process.env.PORT || 10000) },
  });

  console.log(`🚀 Server ready at ${url}`);
}

async function saveDataToDB() {
  try {
    const matchRepository = AppDataSource.manager.getRepository(Match);
    const matchesData = await scrapeMatchesData();
    // const concertsData = await scrapeConcertsData();

    await matchRepository.clear();
    const matches = matchRepository.create(matchesData);
    await matchRepository.save(matches);

    const concertRepository = AppDataSource.manager.getRepository(Concert);
    await concertRepository.clear();
    // const concerts = concertRepository.create(concertsData);
    // console.log(concertsData);
    // await concertRepository.save(concerts);

    console.log("Dados salvos com sucesso no banco de dados.");
  } catch (error) {
    console.error("Erro ao salvar os dados no banco de dados:", error);
  }
}

async function main() {
  try {
    await AppDataSource.initialize();
    await startApolloServer();
    await saveDataToDB();
    await scheduleWhatsAppMessage();
  } catch (error) {
    console.error("Erro no processo principal:", error);
  }
}

main();
