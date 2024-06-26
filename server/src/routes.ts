import { Express } from "express"
import { createUserHandler, getCurrentUser } from "./controller/user.controller";
import validateSchema from "./middleware/validateSchema";
import createUserSchema from "./schemaValidation/user.schema";
import { createUserSessionHandler, deleteSessionHandler, getUserSession, googleOauthHandler } from "./controller/session.controller";
import createSessionSchema from "./schemaValidation/sesssion.schema";
import requireUser from "./middleware/requireUser";
import { createProductHandler, deleteProductHandler, getProductHandler, updateProductHandler } from "./controller/product.controller";
import { createProductSchema, deleteProductSchema, getProductSchema, updateProductSchema } from "./schemaValidation/product.schema";

const routes = async (app: Express) => {

  app.post('/api/v1/users', validateSchema(createUserSchema), createUserHandler)
  app.get('/api/v1/me', requireUser, getCurrentUser);

  app.post('/api/v1/sessions', validateSchema(createSessionSchema), createUserSessionHandler)
  app.get('/api/v1/sessions', requireUser, getUserSession)
  app.delete("/api/v1/sessions", requireUser, deleteSessionHandler);
  app.get("/api/v1/sessions/oauth/google", googleOauthHandler);

  app.post('/api/v1/products', [requireUser, validateSchema(createProductSchema)], createProductHandler);
  app.put('/api/v1/products/:productId', [requireUser, validateSchema(updateProductSchema)], updateProductHandler);
  app.get( '/api/v1/products/:productId', validateSchema(getProductSchema), getProductHandler );
  app.delete('/api/v1/products/:productId', [requireUser, validateSchema(deleteProductSchema)], deleteProductHandler);

}

export default routes;