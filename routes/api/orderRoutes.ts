import { Router } from 'express';
import OrderController from '../../app/controllers/OrderController';
import Call from '../../app/utils/Call';
import auth from '../../app/middlewares/Auth';
import validateRole from '../../app/middlewares/validateRole';
import orderCreateSchema from '../../app/schemas/orderCreateSchema';
import validation from '../../app/middlewares/validate';

const router = Router();
router.get('/', [auth, validateRole('ROLE_LIST_ORDER')], Call(OrderController.index));
router.get('/:order_id', [auth, validateRole('ROLE_SHOW_ORDER')], Call(OrderController.show));
router.post('/', [auth, validateRole('ROLE_CREATE_ORDER')], Call(OrderController.store));
router.post('/:order_id/payment', [auth, validateRole('ROLE_PAYMENT_ORDER'), validation(orderCreateSchema)], Call(OrderController.payment))

export default router;
