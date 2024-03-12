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
exports.scrapeData = void 0;
const puppeteer = require("puppeteer");
function scrapeData() {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer.launch();
        const page = yield browser.newPage();
        // URL da página que você deseja raspar
        const url = "https://www.google.com/search?sca_esv=cfa97c458ab2bfe3&sxsrf=ACQVn0-REaQ748yWAJ77-JZQnb9ZWA4vUg:1710180992612&q=arena+mrv+pr%C3%B3ximos+eventos&stick=H4sIAAAAAAAAAOPgEOLVT9c3NEzLMUivMk3KU0LlaqlmJ1vp5-QnJ5Zk5ufBGValBcn5uZl56QqpZal5JcWLWKUTi1LzEhVyi8oUCooOb67IzM0vhkjmF-9gZQQAM0mYJmgAAAA&sa=X&ved=2ahUKEwjfw8PU6OyEAxXPrZUCHf3fCuEQMXoECFoQDA&biw=1280&bih=654&dpr=2";
        yield page.goto(url);
        yield page.waitForSelector("a[data-entityname]");
        const results = yield page.evaluate(() => {
            const eventCards = document.querySelectorAll("a[data-entityname]");
            const eventList = [];
            eventCards.forEach((card) => {
                const titleElement = card.querySelector(".bVj5Zb");
                const title = (titleElement === null || titleElement === void 0 ? void 0 : titleElement.innerText) || "";
                const dateElement = card.querySelector(".t3gkGd div:first-child");
                const date = (dateElement === null || dateElement === void 0 ? void 0 : dateElement.innerText) || "";
                const timeElement = card.querySelector(".t3gkGd div:last-child");
                const time = (timeElement === null || timeElement === void 0 ? void 0 : timeElement.innerText) || "";
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
        yield browser.close();
        return results;
    });
}
exports.scrapeData = scrapeData;
