import { z } from "zod";

const payload = {
  body: z.object({
    
    title: z.string({
      required_error: "Title is required",
    }),
    
    description: z.string({
      required_error: "Description is required",
    }).min(120, "Description should be at least 120 characters long"),
    
    price: z.number({
      required_error: "Price is required",
    }),
    
    image: z.string({
      required_error: "Image is required",
    }),

  }),  
};
  
const params = {
  params: z.object({
    productId: z.string({
      required_error: "productId is required",
    }),
  }),
};
  
export const createProductSchema = z.object({
  ...payload,
});

export const updateProductSchema = z.object({
  ...payload,
  ...params,
});
  
  
export const deleteProductSchema = z.object({
  ...params,
});
  
export const getProductSchema = z.object({
  ...params,
});   
    
    
export type CreateProductInputType = z.infer<typeof createProductSchema>
export type UpdateProductInputType = z.infer<typeof updateProductSchema>;
export type DeleteProductInputType = z.infer<typeof deleteProductSchema>;
export type ReadProductInput = z.infer<typeof getProductSchema>;