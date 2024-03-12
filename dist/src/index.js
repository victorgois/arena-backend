"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const sanitizer_1 = require("../sanitizer");
const model_1 = require("./model");
// Conexão com o banco de dados MongoDB
mongoose.connect("mongodb://localhost:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.1");
// Função para salvar os dados raspados no banco de dados
function saveDataToDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Raspagem dos dados
            const sanitizedEvents = yield (0, sanitizer_1.sanitizeData)();
            console.log(sanitizedEvents);
            // Salvando os eventos no banco de dados
            yield model_1.eventsModel.insertMany(sanitizedEvents);
            console.log("Dados salvos com sucesso no banco de dados.");
        }
        catch (error) {
            console.error("Erro ao salvar os dados no banco de dados:", error);
        }
    });
}
// Chamada da função para salvar os dados no banco de dados
saveDataToDB();
