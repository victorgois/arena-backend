"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./scrape/index");
// import { sanitizeData } from "./sanitizer/index";
// import { eventsModel } from "./model/model";
// Conexão com o banco de dados MongoDB
/* mongoose.connect(
  "mongodb://localhost:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.1"
); */
// Função para salvar os dados raspados no banco de dados
/* async function saveDataToDB() {
  try {
    // Raspagem dos dados
    const sanitizedEvents = await sanitizeData();
    // Salvando os eventos no banco de dados
    await eventsModel.insertMany(sanitizedEvents);
    console.log("Dados salvos com sucesso no banco de dados.");
  } catch (error) {
    console.error("Erro ao salvar os dados no banco de dados:", error);
  }
} */
// Chamada da função para salvar os dados no banco de dados
// saveDataToDB();
(0, index_1.scrapeData)();
//# sourceMappingURL=index.js.map