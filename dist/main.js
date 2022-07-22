"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_js_1 = __importDefault(require("./routes/api.js"));
const web_js_1 = __importDefault(require("./routes/web.js"));
const server_1 = __importDefault(require("./configs/server"));
//import swagger from './routes/swagger.js';
class Main {
    constructor() {
        this.server = new server_1.default();
        this.server.start();
        this.routes();
        //this.ExceptionConfig();
    }
    routes() {
        this.server.app.use('/', web_js_1.default);
        this.server.app.use('/api', api_js_1.default);
        //this.server.app.use('/', swagger);
        this.server.app.all('*', () => {
            console.log('No se ha encontrado');
        });
    }
}
exports.default = Main;
