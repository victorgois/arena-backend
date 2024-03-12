"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventsModel = void 0;
const mongoose_1 = require("mongoose");
const eventSchema = new mongoose_1.Schema({
    title: String,
    date: mongoose_1.Schema.Types.Mixed,
    time: String,
    url: String,
});
exports.eventsModel = (0, mongoose_1.model)("Event", eventSchema, "arenaEvents");
