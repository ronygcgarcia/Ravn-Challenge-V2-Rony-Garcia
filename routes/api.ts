import { Router } from 'express';
import ApiController from '../app/controllers/ApiController';
import Call from '../app/utils/Call';
import auth from '../app/middlewares/Auth';
import validation from '../app/middlewares/validate';
import loginSchema from '../app/schemas/loginSchema';



const router = Router();
router.post('/v1/login', [validation(loginSchema)], Call(ApiController.login));
router.post('/v1/logout', [auth], Call(ApiController.logout));

export default router;
