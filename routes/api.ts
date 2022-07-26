import { Router } from 'express';
import ApiController from '../app/controllers/ApiController';
import Call from '../app/utils/Call';
import auth from '../app/middlewares/Auth';
import validation from '../app/middlewares/validate';
import loginSchema from '../app/schemas/loginSchema';
import signupSchema from '../app/schemas/signupSchema';
import productRoutes from './api/productRoutes';
import orderRoutes from './api/orderRoutes';
import recoveryPasswordEmailSchema from '../app/schemas/recoveryPasswordEmailSchema';
import changePasswordSchema from '../app/schemas/changePasswordSchema';


const router = Router();
router.post('/v1/login', [validation(loginSchema)], Call(ApiController.login));
router.post('/v1/logout', [auth], Call(ApiController.logout));
router.post('/v1/signup', [validation(signupSchema)], Call(ApiController.signup));
router.get('/v1/user/confirm/:token', Call(ApiController.confirmUser));
router.post('/v1/user/recovery/password', [validation(recoveryPasswordEmailSchema)], Call(ApiController.recoveryPasswordEmail));
router.post('/v1/user/change/password', [validation(changePasswordSchema)], Call(ApiController.changePassword));

router.use('/v1/products', productRoutes);
router.use('/v1/orders', orderRoutes);

export default router;
