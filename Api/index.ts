const mongoose = require("mongoose");
import { sanitizeData } from "../Sanitizer";
import { eventsModel } from "./model";
// Conexão com o banco de dados MongoDB
mongoose.connect(
  "mongodb://localhost:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.1"
);

// Função para salvar os dados raspados no banco de dados
async function saveDataToDB() {
  try {
    // Raspagem dos dados
    const sanitizedEvents = await sanitizeData();
    console.log(sanitizedEvents);
    // Salvando os eventos no banco de dados
    await eventsModel.insertMany(sanitizedEvents);
    console.log("Dados salvos com sucesso no banco de dados.");
  } catch (error) {
    console.error("Erro ao salvar os dados no banco de dados:", error);
  }
}

// Chamada da função para salvar os dados no banco de dados
saveDataToDB();
