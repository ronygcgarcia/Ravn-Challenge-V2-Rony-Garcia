import { Router } from 'express';
import ProductController from '../../app/controllers/ProductController';
import Call from '../../app/utils/Call';

const router = Router();
router.get('/', Call(ProductController.index));
router.get('/:product_id', Call(ProductController.show));

export default router;
