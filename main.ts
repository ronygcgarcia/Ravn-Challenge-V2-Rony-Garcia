import api from './routes/api';
import web from './routes/web';
import MainServer from './configs/server';
import swagger from './routes/swagger';
import Handler from './handlers/Handler';
import NotFoundException from './handlers/NotFoundException';

export default class Main {
  server: MainServer;

  constructor() {
    this.server = new MainServer();
    this.server.start();
    this.routes();
    this.ExceptionConfig();
  }

  routes() {
    this.server.app.use('/', web);
    this.server.app.use('/api', api);
    this.server.app.use('/docs', swagger);
    this.server.app.all('*', () => {
      throw new NotFoundException();
  });
  }

  ExceptionConfig() {
    this.server.app.use(Handler.handle);
  }
}