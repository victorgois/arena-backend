const puppeteer = require("puppeteer");

export async function scrapeData() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // URL da página que você deseja raspar
  const url =
    "https://www.google.com/search?sca_esv=cfa97c458ab2bfe3&sxsrf=ACQVn0-REaQ748yWAJ77-JZQnb9ZWA4vUg:1710180992612&q=arena+mrv+pr%C3%B3ximos+eventos&stick=H4sIAAAAAAAAAOPgEOLVT9c3NEzLMUivMk3KU0LlaqlmJ1vp5-QnJ5Zk5ufBGValBcn5uZl56QqpZal5JcWLWKUTi1LzEhVyi8oUCooOb67IzM0vhkjmF-9gZQQAM0mYJmgAAAA&sa=X&ved=2ahUKEwjfw8PU6OyEAxXPrZUCHf3fCuEQMXoECFoQDA&biw=1280&bih=654&dpr=2";

  await page.goto(url);

  await page.waitForSelector("a[data-entityname]");

  interface EventItem {
    title: string;
    date: string;
    time: string;
    url: string;
  }

  const results = await page.evaluate(() => {
    const eventCards = document.querySelectorAll("a[data-entityname]");
    const eventList: EventItem[] = [];

    eventCards.forEach((card) => {
      const titleElement = card.querySelector(".bVj5Zb") as HTMLElement | null;
      const title = titleElement?.innerText || "";

      const dateElement = card.querySelector(
        ".t3gkGd div:first-child"
      ) as HTMLElement | null;
      const date = dateElement?.innerText || "";

      const timeElement = card.querySelector(
        ".t3gkGd div:last-child"
      ) as HTMLElement | null;
      const time = timeElement?.innerText || "";

      const url = card.getAttribute("href") || "";

      eventList.push({
        title,
        date,
        time,
        url,
      });
    });
    console.log("Dados raspados do google com maestria...");
    return eventList;
  });

  await browser.close();

  return results;
}
