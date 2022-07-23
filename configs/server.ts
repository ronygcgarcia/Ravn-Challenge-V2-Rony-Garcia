import express, {Express, Request, Response} from 'express';
import { createServer, Server } from 'http';
import corsConfig from './cors';
import cors from 'cors'


class MainServer {
  server: Server;
  host: string; 
  port: number; 
  app: Express;
  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT) ||  8000;
    this.server = createServer(this.app);

    this.host = process.env.HOST || 'localhost';
    this.middlewares();
  }

  middlewares() {
    this.app.use(cors(corsConfig));
    this.app.use(express.static('public'));
    this.app.use(express.json());
  }

  start() {
    this.server.listen(this.port, this.host, () => {
      console.log(`http://${this.host}:${this.port}`);
    });
  }
}

export default MainServer;
