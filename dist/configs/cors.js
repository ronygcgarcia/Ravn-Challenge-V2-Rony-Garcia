"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const corsConfig = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    exposedHeaders: ['page', 'per_page', 'total_rows'],
    optionsSuccessStatus: 204,
};
exports.default = corsConfig;
