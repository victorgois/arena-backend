import express = require("express");
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Conexão com o MongoDB
mongoose
  .connect("mongodb://localhost:27017/api", {})
  .then(() => console.log("Conexão com o MongoDB estabelecida"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// Definir modelo do usuário
interface IUser {
  name: string;
  email: string;
}

const User = mongoose.model<IUser>(
  "User",
  new mongoose.Schema({
    name: String,
    email: String,
  })
);

// Rotas da API
app.get("/api/users", async (req: express.Request, res: express.Response) => {
  const users = await User.find();
  res.json(users);
});

app.post("/api/users", async (req: express.Request, res: express.Response) => {
  const { name, email } = req.body;
  const user = new User({ name, email });
  await user.save();
  res.json(user);
});

// Outras rotas e operações CRUD podem ser adicionadas conforme necessário

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
