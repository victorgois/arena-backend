import twilio from "twilio";
import { resolvers } from "./resolvers";

import dotenv from "dotenv";
dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function handleIncomingMessage(message: string, from: string) {
  if (message.toLowerCase().includes("receber atualizações")) {
    // Adicionar o usuário à lista de inscritos
    await addSubscriber(from);
    return "Você foi inscrito com sucesso para receber atualizações sobre os jogos!";
  }
  // Adicione mais lógica de resposta conforme necessário
}

async function addSubscriber(phoneNumber: string) {
  // Implemente a lógica para adicionar o número de telefone ao seu banco de dados
  console.log(`Novo inscrito: ${phoneNumber}`);
}

async function getSubscribedUsers() {
  // Implemente a lógica para obter os usuários inscritos
  return []; // Retorna uma lista de usuários inscritos
}

export async function scheduleWhatsAppMessage() {
  const subscribedUsers = await getSubscribedUsers();
  const matches = await resolvers.Query.matches();

  if (matches.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Ordena os matches por data e pega o primeiro (próximo evento)
    const nextMatch = matches.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )[0];
    const matchDate = new Date(nextMatch.date);
    matchDate.setHours(0, 0, 0, 0);

    let message;

    if (matchDate.getTime() === today.getTime()) {
      // Mensagem para matches que acontecem hoje
      message = `🚨 *ATENÇÃO! Jogo HOJE!* 🚨\n\n*${
        nextMatch.homeTeam.name
      }* vs *${nextMatch.awayTeam.name}*\n\n⏰ Horário: _${new Date(
        nextMatch.date
      ).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })}_\n\n🏟️ Local: _${
        nextMatch.venue || "Arena MRV"
      }_\n\n🎟️ Já garantiu seu ingresso? Não perca essa partida!\n\n#VamoGalo #DiaDeMRV`;
    } else {
      // Mensagem para matches futuros
      message = `*Lembrete:* O próximo evento *${
        nextMatch.homeTeam.name
      }* vs *${nextMatch.awayTeam.name}* ocorrerá em _${new Date(
        nextMatch.date
      ).toLocaleString("pt-BR", {
        dateStyle: "full",
        timeStyle: "short",
      })}_. Se liga hein!`;
    }

    for (const user of subscribedUsers) {
      await sendWhatsAppMessage(user.phoneNumber, message);
    }
  } else {
    console.log("Nenhum match encontrado.");
  }
}

async function sendWhatsAppMessage(to: string, body: string) {
  try {
    await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${to}`,
      body: body,
    });
    console.log("Mensagem enviada!");
  } catch (error) {
    console.error("Erro ao enviar mensagem: ", error);
  }
}
