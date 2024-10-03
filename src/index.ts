import "reflect-metadata";
import { DataSource } from "typeorm";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { scrapeMatchesData, scrapeConcertsData } from "./scrape/index";
import { Match, Concert } from "./model";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { scheduleWhatsAppMessage, handleIncomingMessage } from "./whatsappBot";
import dotenv from "dotenv";

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

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Wrap this in an async function
  async function startServer() {
    await server.start();
    const urlPrefix =
      process.env.NODE_ENV === "development"
        ? "http://localhost"
        : "https://eventos-arena-mrv.onrender.com";

    app.use(
      "/graphql",
      cors({
        origin: [
          "http://localhost:3000",
          "https://eventos-arena-mrv.onrender.com",
        ],
        credentials: true,
        allowedHeaders: ["content-type"],
      }),
      bodyParser.json(),
      expressMiddleware(server)
    );

    const port = process.env.PORT || 4000;

    app.listen(port, () => {
      console.log(`Server is running on ${urlPrefix}:${port}/graphql`);
    });
  }

  startServer();
}

async function saveDataToDB() {
  try {
    const matchRepository = AppDataSource.manager.getRepository(Match);
    await matchRepository.clear();

    const matchesData = await scrapeMatchesData();
    const validMatches = matchesData.filter((match) => match.date !== null);

    const matches = matchRepository.create(validMatches);
    await matchRepository.save(matches);

    console.log("Dados salvos com sucesso no banco de dados.");
  } catch (error) {
    console.error("Erro ao salvar os dados no banco de dados:", error);
  }
}

async function main() {
  try {
    await AppDataSource.initialize();
    console.log("Conectado ao PostgreSQL");
    await startApolloServer();
    await saveDataToDB();
    await scheduleWhatsAppMessage();
  } catch (error) {
    console.error("Erro no processo principal:", error);
  }
}

main();
