import { Router } from 'express';
import OrderController from '../../app/controllers/OrderController';
import Call from '../../app/utils/Call';
import auth from '../../app/middlewares/Auth';

const router = Router();
router.get('/', [auth], Call(OrderController.index));
router.get('/:order_id', [auth], Call(OrderController.show));

export default router;
