import dotenv from "dotenv";
import twilio from "twilio";
import { resolvers } from "./resolvers";

dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function scheduleWhatsAppMessage() {
  const userPhoneNumber = process.env.USER_PHONE_NUMBER;
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

    await sendWhatsAppMessage(userPhoneNumber, message);
  } else {
    console.log("Nenhum match encontrado.");
  }
}

async function sendWhatsAppMessage(to: string, body: string) {
  try {
    await client.messages.create({
      from: "whatsapp:+14155238886",
      to: `whatsapp:${to}`,
      body: body,
    });
    console.log("Mensagem enviada!");
  } catch (error) {
    console.error("Erro ao enviar mensagem: ", error);
  }
}
