import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import { ProductDocumentType } from "../utils/types";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
    default: () => `product_${nanoid()}`
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }
});

const ProductModel = mongoose.model<ProductDocumentType>("Product", productSchema);
export default ProductModel;