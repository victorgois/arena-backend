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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
// Conexão com o MongoDB
mongoose_1.default
    .connect("mongodb://localhost:27017/api", {})
    .then(() => console.log("Conexão com o MongoDB estabelecida"))
    .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));
const User = mongoose_1.default.model("User", new mongoose_1.default.Schema({
    name: String,
    email: String,
}));
// Rotas da API
app.get("/api/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User.find();
    res.json(users);
}));
app.post("/api/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = req.body;
    const user = new User({ name, email });
    yield user.save();
    res.json(user);
}));
// Outras rotas e operações CRUD podem ser adicionadas conforme necessário
// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
