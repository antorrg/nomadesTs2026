import express from "express";
import { ProductRepository } from "./ProductRepository.js";
import { ProductService } from "./ProductService.js"
import { ProductController } from "./ProductController.js"
import { mockProduct } from "./ProductMappers.js"
import { Validator } from 'req-valid-express'
import { create, update} from './validationSchemas/productschemas.js'
import { itemCreate, itemUpdate } from "./validationSchemas/itemSchemas.js";
import { isAuthenticated, authorizeMinRole, UserRole } from "../../Shared/Auth/authMiddlewares.js";

const repository = new ProductRepository(mockProduct as any)
const service = new ProductService(repository)
const controller = new ProductController(service)

const productRouter = express.Router();

// --- Rutas Públicas  ---
productRouter.get("/public", controller.scopedGet);
productRouter.get("/public/:id", Validator.paramId('id', Validator.ValidReg.INT),controller.scopedGetById);
productRouter.get("/public/item/:id", Validator.paramId('id', Validator.ValidReg.INT),controller.scopedGetItem);

// --- Rutas de Productos ---
productRouter.get("/", isAuthenticated, controller.getAll);

productRouter.get("/:id", isAuthenticated, Validator.paramId('id', Validator.ValidReg.INT), controller.getById);
productRouter.post("/", isAuthenticated, Validator.validateBody(create),controller.create);
productRouter.put("/:id", isAuthenticated, Validator.paramId('id', Validator.ValidReg.INT),Validator.validateBody(update), controller.update);
productRouter.delete("/:id", isAuthenticated, authorizeMinRole(UserRole.MODERATOR),Validator.paramId('id', Validator.ValidReg.INT),controller.delete);

// --- Rutas de Ítems ---
productRouter.get("/item/:id", isAuthenticated, Validator.paramId('id', Validator.ValidReg.INT),controller.getItem);
productRouter.post("/item", isAuthenticated, Validator.validateBody(itemCreate),controller.createItem);
productRouter.put("/item/:id", isAuthenticated, Validator.paramId('id', Validator.ValidReg.INT), Validator.validateBody(itemUpdate),controller.updateItem);
productRouter.delete("/item/:id", isAuthenticated, authorizeMinRole(UserRole.MODERATOR),Validator.paramId('id', Validator.ValidReg.INT),controller.deleteItem);

export default productRouter;