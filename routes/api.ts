import { Router } from 'express';
import ApiController from '../app/controllers/ApiController';
import Call from '../app/utils/Call';

const router = Router();
router.post('/v1/login', Call(ApiController.login));

export default router;
