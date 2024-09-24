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
exports.scrapeData = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
function scrapeData() {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer_1.default.launch();
        const page = yield browser.newPage();
        const url = "https://www.google.com/search?q=arena+mrv+pr%C3%B3ximos+eventos&oq=arena+mrv&gs_lcrp=EgZjaHJvbWUqDggCEEUYJxg7GIAEGIoFMgcIABAAGI8CMhMIARAuGK8BGMcBGLEDGIAEGI4FMg4IAhBFGCcYOxiABBiKBTIOCAMQRRgnGDsYgAQYigUyBwgEEAAYgAQyBwgFEAAYgAQyBggGEEUYPDIGCAcQRRg80gEIMjY0NGowajeoAgCwAgA&sourceid=chrome&ie=UTF-8";
        yield page.goto(url);
        const results = yield page.evaluate(() => {
            const eventList = [];
            const eventElements = document.querySelectorAll(".ULSxyf");
            eventElements.forEach((element) => {
                const dateElement = element.querySelector(".YmWhbc");
                const timeElement = element.querySelector(".MgUUmf");
                const titleElement = element.querySelector(".vk_gy.vk_sh");
                if (dateElement && timeElement && titleElement) {
                    const fullTitle = titleElement.textContent || "";
                    const [opponent, competition] = fullTitle.split(" - ");
                    eventList.push({
                        date: dateElement.textContent || "",
                        time: timeElement.textContent || "",
                        title: fullTitle,
                        opponent: opponent.trim(),
                        competition: competition ? competition.trim() : "",
                    });
                }
            });
            return eventList;
        });
        yield browser.close();
        console.log("Dados raspados do Google com sucesso:", results);
        return results;
    });
}
exports.scrapeData = scrapeData;
//# sourceMappingURL=index.js.map