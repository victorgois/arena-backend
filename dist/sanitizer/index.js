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
exports.sanitizeData = void 0;
const index_1 = require("../scrape/index");
function isValidDateString(date) {
    const regex = /^[a-zA-Záéíóúâêîôûàèìòùäëïöüç]{3}\., \d{1,2} de [a-zA-Záéíóúâêîôûàèìòùäëïöüç]{3}\.$/i;
    const isValid = regex.test(date);
    return isValid;
}
const months = {
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
function sanitizeData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield (0, index_1.scrapeData)();
            /* for (let i = 0; i < data.length; i++) {
              const dateString = data[i].date;
              if (isValidDateString(dateString)) {
                const sanitizedDateString = dateString
                  .replace(/^[a-zA-Záéíóúãõâêîôûàèìòùäëïöüç]+\.,/, "")
                  .trim();
        
                data[i].date = parseDate(sanitizedDateString, data[i].time);
              }
            } */
            return data;
        }
        catch (error) {
            console.error("Erro ao sanitizar dados", error);
            throw error;
        }
    });
}
exports.sanitizeData = sanitizeData;
function parseDate(date, time) {
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
        throw new Error("Formato de hora invalido ou horario do evento nao esta presente!");
    }
    throw new Error("Formato de mes invalido!");
}
//# sourceMappingURL=index.js.map