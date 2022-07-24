import { Router } from 'express';
import ProductController from '../../app/controllers/ProductController';
import Call from '../../app/utils/Call';
import auth from '../../app/middlewares/Auth';
import validation from '../../app/middlewares/validate';
import productCreateSchema from '../../app/schemas/productCreateSchema';

const router = Router();
router.get('/', Call(ProductController.index));
router.get('/:product_id', Call(ProductController.show));
router.post('/', [auth, validation(productCreateSchema)], Call(ProductController.store))

export default router;
