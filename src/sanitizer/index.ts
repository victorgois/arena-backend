import { scrapeData } from "../scrape";

function isValidDateString(date: string): boolean {
  const regex =
    /^[a-zA-Záéíóúâêîôûàèìòùäëïöüç]{3}\., \d{1,2} de [a-zA-Záéíóúâêîôûàèìòùäëïöüç]{3}\.$/i;
  const isValid = regex.test(date);
  return isValid;
}
const months: { [key: string]: number } = {
  jan: 0,
  fev: 1,
  mar: 2,
  abr: 3,
  mai: 4,
  jun: 5,
  jul: 6,
  ago: 7,
  set: 8,
  out: 9,
  nov: 10,
  dez: 11,
};

interface ScrapedData {
  title: string;
  date: Date | string;
  time: string;
  url: string;
}

export async function sanitizeData(): Promise<ScrapedData[]> {
  try {
    const data = await scrapeData();

    for (let i = 0; i < data.length; i++) {
      const dateString = data[i].date;
      if (isValidDateString(dateString)) {
        const sanitizedDateString = dateString
          .replace(/^[a-zA-Záéíóúãõâêîôûàèìòùäëïöüç]+\.,/, "")
          .trim();

        data[i].date = parseDate(sanitizedDateString, data[i].time);
      }
    }
    return data;
  } catch (error) {
    console.error("Erro ao sanitizar dados", error);
    throw error;
  }
}

function parseDate(date: string, time: string): Date {
  const [dayString, monthString] = date.split(" de ");
  const monthMatch = monthString.match(/[a-zA-Z]+/);
  if (monthMatch) {
    const month = months[monthMatch[0].toLowerCase()];
    const day = parseInt(dayString);
    const currentYear = new Date().getFullYear();
    const parsedDate = new Date(currentYear, month, day);

    if (time) {
      const [hours, minutes] = time.split(":");
      parsedDate.setHours(Number(hours));
      parsedDate.setMinutes(Number(minutes));

      const timezoneOffset = -3 * 60; // Offset do fuso horário brasileiro em minutos
      parsedDate.setMinutes(parsedDate.getMinutes() + timezoneOffset);

      return parsedDate;
    }

    throw new Error(
      "Formato de hora invalido ou horario do evento nao esta presente!"
    );
  }
  throw new Error("Formato de mes invalido!");
}
