import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import { databaseResponseTimeHistogram } from "../utils/metrics";
import { ProductDocumentType, ProductInputType } from "../utils/types";
import ProductModel from "../models/product.model";

export const createProduct = async(input: ProductInputType) =>{
  const metricsLabels = {
    operation: "createProduct",
  };

  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const result = await ProductModel.create(input);
    timer({ ...metricsLabels, success: "true" });
    return result;
  } catch (e) {
    timer({ ...metricsLabels, success: "false" });
    throw e;
  }
}

export async function findProduct(
  query: FilterQuery<ProductDocumentType>,
  options: QueryOptions = { lean: true }
) {
  const metricsLabels = {
    operation: "findProduct",
  };

  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const result = await ProductModel.findOne(query, {}, options);
    timer({ ...metricsLabels, success: "true" });
    return result;
  } catch (e) {
    timer({ ...metricsLabels, success: "false" });

    throw e;
  }
}

export const findAndUpdateProduct = async(
  query: FilterQuery<ProductDocumentType>,
  update: UpdateQuery<ProductDocumentType>,
  options: QueryOptions
) => {
  return ProductModel.findOneAndUpdate(query, update, options);
}

export const deleteProduct = async (query: FilterQuery<ProductDocumentType>) =>{
  return ProductModel.deleteOne(query);
}
