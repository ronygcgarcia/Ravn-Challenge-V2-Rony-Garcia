import { Router } from 'express';
import ApiController from '../app/controllers/ApiController';
import Call from '../app/utils/Call';
import auth from '../app/middlewares/Auth';
import validation from '../app/middlewares/validate';
import loginSchema from '../app/schemas/loginSchema';
import signupSchema from '../app/schemas/signupSchema';
import productRoutes from './api/productRoutes';


const router = Router();
router.post('/v1/login', [validation(loginSchema)], Call(ApiController.login));
router.post('/v1/logout', [auth], Call(ApiController.logout));
router.post('/v1/signup', [validation(signupSchema)], Call(ApiController.signup));
router.get('/v1/user/confirm/:token', Call(ApiController.confirmUser));

router.use('/v1/products', productRoutes);

export default router;
