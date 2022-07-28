import express, { Express } from 'express';
import { createServer, Server } from 'http';
import cors from 'cors'
import fileupload from 'express-fileupload';
import corsConfig from './cors';


class MainServer {
  server: Server;

  host: string;

  port: number;

  app: Express;

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT) || 8000;
    this.server = createServer(this.app);

    this.host = process.env.HOST || 'localhost';
    this.middlewares();
  }

  middlewares() {
    this.app.use(fileupload({
      createParentPath: true,
    }));
    this.app.use(cors(corsConfig));
    this.app.use(express.static('public'));
    this.app.use(express.json());
  }

  start() {
    this.server.listen(this.port, () => {
      console.log(`http://${this.host}:${this.port}`);
    });
  }
}

export default MainServer;
