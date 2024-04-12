import { Request, Response } from "express";
import { createProduct, deleteProduct, findAndUpdateProduct, findProduct } from "../services/product.service";
import { CreateProductInputType, UpdateProductInputType } from "../schemaValidation/product.schema";


export const createProductHandler = async ( req: Request<{}, {}, CreateProductInputType["body"]>, res: Response ) => {
  const userId = res.locals.user._id;
  const body = req.body;
  const product = await createProduct({ ...body, user: userId });
  return res.send(product);
}

export async function updateProductHandler( req: Request<UpdateProductInputType["params"]>, res: Response ) {
  const userId = res.locals.user._id;
  const productId = req.params.productId;
  const update = req.body;
  const product = await findProduct({ productId });

  if (!product) {
    return res.sendStatus(404);
  }

  if (String(product.user) !== userId) {
    return res.sendStatus(403);
  }

  const updatedProduct = await findAndUpdateProduct({ productId }, update, {
    new: true,
  });

  return res.send(updatedProduct);
}

export const getProductHandler = async ( req: Request<UpdateProductInputType["params"]>, res: Response) => {
  const productId = req.params.productId;

  const product = await findProduct({ productId });

  if (!product) {
    return res.sendStatus(404);
  }

  return res.send(product);
}

export const deleteProductHandler = async ( req: Request<UpdateProductInputType["params"]>, res: Response ) => {
  const userId = res.locals.user._id;

  const productId = req.params.productId;

  const product = await findProduct({ productId });

  if (!product) {
    return res.sendStatus(404);
  }

  if (String(product.user) !== userId) {
    return res.sendStatus(403);
  }

  await deleteProduct({ productId });

  return res.sendStatus(200);
}
