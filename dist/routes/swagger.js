"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable guard-for-in */
// Aquí se hace el routing hacia la documentación de la API.
const express_1 = require("express");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const path_1 = __importStar(require("path"));
const url_1 = require("url");
const js_yaml_1 = __importDefault(require("js-yaml"));
const fs_1 = __importDefault(require("fs"));
// Creando variable encargada de la direccion del archivo YAML principal
// eslint-disable-next-line no-underscore-dangle
const __dirname = (0, path_1.dirname)((0, url_1.fileURLToPath)(import.meta.url));
// Se lee el archivo openapi.YAML que se cargará en /api/docs/local (swagger interno)
const swaggerDocument = yamljs_1.default.load(path_1.default.join(__dirname, '../app/docs/index.yaml'));
// Se lee el archivo openapi.YAML que se cargará en /api/docs (swagger publico)
const swaggerDocumentPublic = yamljs_1.default.load(path_1.default.join(__dirname, '../app/docs/index.yaml'));
// Se lee el archivo openapi.YAML para eliminar la propiedad area de los paths.
const swaggerDocumentModify = yamljs_1.default.load(path_1.default.join(__dirname, '../app/docs/index.yaml'));
const router = (0, express_1.Router)();
// eslint-disable-next-line no-restricted-syntax
for (const pat in swaggerDocumentModify.paths) {
    delete swaggerDocumentModify.paths[pat].area;
}
const swaggerTemporal = js_yaml_1.default.dump(swaggerDocumentModify);
fs_1.default.writeFileSync(path_1.default.join(__dirname, '../app/docs/test.yaml'), swaggerTemporal, 'utf8');
// cambio del titulo del swagger interno
swaggerDocument.info.title = 'Documentación de la API de la Plantilla - Development';
// correcion del swagger publico, aqui se eliminan los paths con la propiedad "area: development"
// eslint-disable-next-line no-restricted-syntax
for (const pat in swaggerDocumentPublic.paths) {
    // comprueba si existe una propiedad "area: development"
    if (swaggerDocumentPublic.paths[pat].area === 'development') {
        delete swaggerDocumentPublic.paths[pat];
    }
}
// eslint-disable-next-line no-restricted-syntax
for (const pat in swaggerDocument.paths) {
    // comprueba si existe una propiedad "area: development"
    if (swaggerDocument.paths[pat].area === 'api') {
        delete swaggerDocument.paths[pat];
    }
}
// Se establece la ruta hacia el Swagger Interno
router.use('/local', swagger_ui_express_1.default.serveFiles(swaggerDocument), swagger_ui_express_1.default.setup(swaggerDocument));
// Se establece la ruta hacia el swagger publico
router.use('/docs', swagger_ui_express_1.default.serveFiles(swaggerDocumentPublic), swagger_ui_express_1.default.setup(swaggerDocumentPublic));
// Ruta del archivo json de la documentacion
router.use('/api/doc.json', (req, res) => {
    res.header('Content-Type', 'application/json');
    res.sendFile(path_1.default.join(__dirname, '../app/docs/test.json'));
});
exports.default = router;
