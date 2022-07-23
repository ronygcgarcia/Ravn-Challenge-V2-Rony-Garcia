import { Router } from 'express';
import ApiController from '../app/controllers/ApiController';
import Call from '../app/utils/Call';

const router = Router();
router.post('/v1/login', Call(ApiController.login))
router.post('/v1/logout', Call(ApiController.logout))
router.post('/v1/signin', Call(ApiController.signin))

//product endpoints
router.post('/v1/products', Call(ApiController.createProduct))
router.get('/v1/products', Call(ApiController.getProducts))
router.get('/v1/products/:productId', Call(ApiController.getProduct))
router.put('/v1/products/:productId', Call(ApiController.updateProduct))
router.delete('/v1/login/:productId', Call(ApiController.deleteProduct))
router.patch('/v1/login/:productId', Call(ApiController.disableProduct))
router.get('/v1/orders',Call(ApiController.getAllOrders));

/*shop endpoints*/
// shopping cart
router.post('/v1/cart',Call(ApiController.addToCart));
router.get('/v1/cart',Call(ApiController.getCart));

//order and buy
router.post('/v1/buy',Call(ApiController.buyOrder));
router.post('/v1/products/:productId/reaction',Call(ApiController.reactToProduct));
router.post('/v1/orders/:orderId',Call(ApiController.getOrder));

export default router;
