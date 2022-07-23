import api from './routes/api.js';
import web from './routes/web.js';
import MainServer from './configs/server';
import swagger from './routes/swagger';

export default class Main {
  server: MainServer;
  constructor() {
    this.server = new MainServer();
    this.server.start();
    this.routes();
  }

  routes() {
    this.server.app.use('/', web);
    this.server.app.use('/api', api);
    this.server.app.use('/docs', swagger);
  }
}