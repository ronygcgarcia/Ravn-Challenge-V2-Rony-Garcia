import { Router } from 'express';
import ProductController from '../../app/controllers/ProductController';
import Call from '../../app/utils/Call';
import auth from '../../app/middlewares/Auth';
import validation from '../../app/middlewares/validate';
import productCreateSchema from '../../app/schemas/productCreateSchema';
import productUpdateSchema from '../../app/schemas/productUpdateSchema';
import productSetStatusSchema from '../../app/schemas/productSetStatusSchema';
import addCartSchema from '../../app/schemas/addCartSchema';

const router = Router();
router.get('/', Call(ProductController.index));
router.get('/:product_id', Call(ProductController.show));
router.post('/', [auth, validation(productCreateSchema)], Call(ProductController.store));
router.put('/:product_id', [auth, validation(productUpdateSchema)], Call(ProductController.update));
router.delete('/:product_id', [auth], Call(ProductController.delete));
router.patch('/:product_id', [auth, validation(productSetStatusSchema)], Call(ProductController.setStatus));
router.put('/:product_id/image', [auth], Call(ProductController.uploadImage));
router.post('/:product_id/cart', [auth, validation(addCartSchema)], Call(ProductController.addCart));
router.delete('/:product_id/cart', [auth, validation(addCartSchema)], Call(ProductController.removeCart));

export default router;
