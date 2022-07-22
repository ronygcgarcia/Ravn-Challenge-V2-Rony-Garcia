"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
class MainServer {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = Number(process.env.PORT) || 8000;
        this.server = (0, http_1.createServer)(this.app);
        this.host = process.env.HOST || 'localhost';
        this.middlewares();
    }
    middlewares() {
        /*this.app.use(fileupload({
          createParentPath: true,
        }));
        this.app.use(cors(corsConfig));
        this.app.use(express.static('public'));
        this.app.use(express.json());*/
    }
    start() {
        this.server.listen(this.port, this.host, () => {
            console.log(`http://${this.host}:${this.port}`);
        });
    }
}
exports.default = MainServer;
