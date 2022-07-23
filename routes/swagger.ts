import { Router } from 'express';
import swaggerUiExpress from 'swagger-ui-express';
import YAML from 'yamljs'
import path, { dirname } from 'path';

const swaggerDocumentPublic = YAML.load(path.join(__dirname, '../app/docs/index.yaml'));

const router = Router();

router.use(
  '/',
  swaggerUiExpress.serveFiles(swaggerDocumentPublic),
  swaggerUiExpress.setup(swaggerDocumentPublic),
);

export default router;