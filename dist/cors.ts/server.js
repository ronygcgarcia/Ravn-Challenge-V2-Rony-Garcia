"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_mjs_1 = __importDefault(require("./cors.mjs"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.server = (0, http_1.createServer)(this.app);
        this.port = process.env.PORT || 8000;
        this.host = process.env.HOST || 'localhost';
        this.middlewares();
    }
    middlewares() {
        this.app.use((0, express_fileupload_1.default)({
            createParentPath: true,
        }));
        this.app.use((0, cors_1.default)(cors_mjs_1.default));
        this.app.use(express_1.default.static('public'));
        this.app.use(express_1.default.json());
    }
    start() {
        this.server.listen(this.port, this.host, () => {
            // eslint-disable-next-line no-console
            console.log(`http://${this.host}:${this.port}`);
        });
    }
}
exports.default = new Server();
