import { Router } from 'express';
import OrderController from '../../app/controllers/OrderController';
import Call from '../../app/utils/Call';
import auth from '../../app/middlewares/Auth';

const router = Router();
router.get('/', [auth], Call(OrderController.index));
router.get('/:order_id', [auth], Call(OrderController.show));
router.post('/', [auth], Call(OrderController.store));
router.post('/:order_id/payment', [auth], Call(OrderController.payment))

export default router;
