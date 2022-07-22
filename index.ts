import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT ||  8000;

app.get('/', (req, res) => {
  res.send({
    message: `Running on port with typescript ${port}`,
  });
});

app.listen(port, () => {
  console.log(`Running on port with typescript ${port}`);
});
