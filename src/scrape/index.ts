import axios from "axios";
import * as cheerio from "cheerio";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { setTimeout } from "timers/promises";

function parseDate(date: string | Date): Date | boolean {
  dayjs.extend(customParseFormat);
  const currentYear = new Date().getFullYear();

  if (date instanceof Date) {
    return date;
  }

  const [datePart, timePart] = date.split(" às ");
  const [day, month] = datePart.split("/");

  if (!timePart || timePart.toLocaleLowerCase() === "a definir") {
    return false;
  }
  return dayjs(
    `${day}-${month}-${currentYear} ${timePart}`,
    "DD-MM-YYYY HH:mm"
  ).toDate();
}

function compareDateWithToday(date: string | Date): boolean {
  const parsedDate = parseDate(date);
  if (!parsedDate) throw new Error("Data inválida");

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Resetar as horas para comparar apenas as datas

  if (parsedDate < today) {
    return false;
  } else {
    return true;
  }
}

export async function scrapeMatchesData() {
  const url = "https://atletico.com.br/futebol/agenda/";
  const html = await axios.get(url);

  try {
    const $ = cheerio.load(html.data);
    const matches = [];

    $(".partida").each((index, element) => {
      const match: any = {};

      match.timeConfirmed = parseDate(
        $(element).find(".partida-data span").first().text().trim()
      )
        ? true
        : false;

      match.date = parseDate(
        $(element).find(".partida-data span").first().text().trim()
      );

      if (match.date === false) {
        // If parseDate returns false, set a default date or skip this match
        return;
      }
      const venueMatch = $(element)
        .find(".partida-data")
        .text()
        .match(/Arena MRV/);

      match.venue = venueMatch ? venueMatch[0] : "";

      match.championship = $(element).find(".partida-campeonato").text().trim();

      match.homeTeam = {
        name: $(element).find(".mandante abbr").attr("title"),
        abbreviation: $(element).find(".mandante abbr").text(),
        logoUrl: $(element).find(".mandante img").attr("src"),
      };

      match.awayTeam = {
        name: $(element).find(".visitante abbr").attr("title"),
        abbreviation: $(element).find(".visitante abbr").text(),
        logoUrl: $(element).find(".visitante img").attr("src"),
      };

      const scores = $(element).find(".versus span");
      if (scores.length === 2) {
        match.homeScore = $(scores[0]).text();
        match.awayScore = $(scores[1]).text();
      }

      match.status = $(element).hasClass("partida-finalizada")
        ? "Finalizada"
        : "Agendada";

      const linkElement = $(element).find(".partida-botoes a");
      if (linkElement.length > 0) {
        match.detailsLink = linkElement.attr("href");
      }

      if (
        match.status !== "Finalizada" &&
        compareDateWithToday(match.date) &&
        match.venue === "Arena MRV"
      ) {
        matches.push(match);
      }
      console.log(match);
    });

    return matches;
  } catch (error) {
    console.error(error);
  }
}

export async function scrapeConcertsData() {
  const url =
    "https://www.eventim.com.br/city/belo-horizonte-1139/venue/arena-mrv-90744/";
  try {
    await setTimeout(1000); // Wait 1 second before each request
    const html = await axios.get(url, { timeout: 30000 });
    try {
      const $ = cheerio.load(html.data);
      const concerts = [];

      $(".listing-item-wrapper-inside-card").each((index, element) => {
        const concert: any = {};

        concert.name = $(element).find("h2.event-listing-city").text().trim();
        concert.status = $(element)
          .find("[data-qa='list-event-state']")
          .text()
          .trim();

        const dateElement = $(element).find("[data-qa='event-date']");
        const day = dateElement
          .find("[data-qa='event-date-day']")
          .text()
          .trim();
        const monthYear = dateElement
          .find("[data-qa='event-date-month-year']")
          .text()
          .trim();
        const time = dateElement
          .find("[data-qa='event-date-time']")
          .text()
          .trim();
        concert.date = `${day} ${monthYear} ${time}`;

        concert.venue = "Arena MRV";

        const jsonLd = JSON.parse(
          $(element).find("script[type='application/ld+json']").html()
        );
        concert.time = jsonLd.startDate
          ? new Date(jsonLd.startDate).toLocaleTimeString("pt-BR")
          : "";

        concert.detailsLink = $(element)
          .find("a[data-qa='continue-button']")
          .attr("href");

        concerts.push(concert);
        console.log(concert);
      });

      return concerts;
    } catch (error) {
      console.error("Error parsing data:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
