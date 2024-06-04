import { z } from "zod";
const orderSchema = z.object({
  customer_name: z.string().min(1, "Customer name is required"),
  shipping_address: z.string().min(1, "Shipping Address is required"),
  product_name: z.string().min(1, "Product name is required"),
  price: z.string().min(1, "Price is required"),
  quantity: z.string().min(1, "Quantity is required"),
  status: z.string().min(1, "Status is required"),
});
export const createOrderSchema = orderSchema;
export const editOrderSchema = z.object({
  id: z.string().optional(),
  order_id: z.string().min(1, "Order ID is required"),
  ...orderSchema.shape,
});
export type CreateOrderSchemaType = z.infer<typeof createOrderSchema>;
export type EditOrderSchemaType = z.infer<typeof editOrderSchema>;
