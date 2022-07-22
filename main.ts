import api from './routes/api.js';
import web from './routes/web.js';
import MainServer from './configs/server';
//import swagger from './routes/swagger.js';

export default class Main {
    server: MainServer;
  constructor() {
    this.server = new MainServer();
    
    this.server.start();
    this.routes();
    //this.ExceptionConfig();
  }

  routes() {
    this.server.app.use('/', web);
    this.server.app.use('/api', api);
    //this.server.app.use('/', swagger);
    this.server.app.all('*', () => {
        console.log('No se ha encontrado');
    });
  }

  /*ExceptionConfig() {
    this.server.app.use(Handler.logErrorMiddleware);
    this.server.app.use(Handler.handlerError);
  }*/
}
