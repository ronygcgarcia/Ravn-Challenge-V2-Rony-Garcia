import { Router } from 'express';
import ProductController from '../../app/controllers/ProductController';
import Call from '../../app/utils/Call';
import auth from '../../app/middlewares/Auth';
import validation from '../../app/middlewares/validate';
import productCreateSchema from '../../app/schemas/productCreateSchema';
import productUpdateSchema from '../../app/schemas/productUpdateSchema';
import productSetStatusSchema from '../../app/schemas/productSetStatusSchema';
import addCartSchema from '../../app/schemas/addCartSchema';
import validateRole from '../../app/middlewares/validateRole';

const router = Router();
router.get('/', Call(ProductController.index));
router.get('/:product_id', Call(ProductController.show));
router.post('/', [auth, validation(productCreateSchema), validateRole('ROLE_CREATE_PRODUCTS')], Call(ProductController.store));
router.put('/:product_id', [auth, validation(productUpdateSchema), validateRole('ROLE_UPDATE_PRODUCTS')], Call(ProductController.update));
router.delete('/:product_id', [auth, validateRole('ROLE_DELETE_PRODUCTS')], Call(ProductController.delete));
router.patch('/:product_id', [auth, validation(productSetStatusSchema), validateRole('ROLE_DISABLE_PRODUCTS')], Call(ProductController.setStatus));
router.put('/:product_id/image', [auth, validateRole('ROLE_CREATE_PRODUCT_IMAGES')], Call(ProductController.uploadImage));
router.post('/cart', [auth, validation(addCartSchema), validateRole('ROLE_ADD_CART_PRODUCT')], Call(ProductController.addCart));
router.delete('/:product_id/cart', [auth, validateRole('ROLE_REMOVE_CART_PRODUCT')], Call(ProductController.removeCart));
router.post('/:product_id/reaction', [auth, validateRole('ROLE_CREATE_REACTION_PRODUCT')], Call(ProductController.setReaction));

router.get('/:product_image_id/image', Call(ProductController.getImage));

export default router;
