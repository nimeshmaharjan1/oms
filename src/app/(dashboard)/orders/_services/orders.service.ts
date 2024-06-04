import type { ResponseType } from "@/types/global.types";
import type { Order } from "@prisma/client";
import axios, { type AxiosResponse } from "axios";
import type {
  CreateOrderSchemaType,
  EditOrderSchemaType,
} from "../_schemas/orders.schema";
import type { OrderSummaryResponseTye } from "../_types/order-summary.types";

export const getAllOrders = async ({
  params,
}: {
  params?: Record<string, any>;
}) => {
  const response: AxiosResponse<ResponseType<Order[]>> = await axios.get(
    "/orders/api",
    {
      params,
    }
  );
  return response.data;
};
export const getSingleOrder = async (id: string) => {
  const response: AxiosResponse<ResponseType<Order>> = await axios.get(
    `/orders/api/${id}`
  );
  return response.data;
};

export const createOrder = async (payload: CreateOrderSchemaType) => {
  const response: AxiosResponse<ResponseType<[]>> = await axios.post(
    "/orders/api",
    payload
  );
  return response.data;
};
export const editOrder = async (payload: EditOrderSchemaType) => {
  const response: AxiosResponse<ResponseType<Order>> = await axios.put(
    `/orders/api/${payload.id}`,
    payload
  );
  return response.data;
};

export const deleteOrder = async (id: string) => {
  const response: AxiosResponse<ResponseType<Order>> = await axios.delete(
    `/orders/api/${id}`
  );
  return response.data;
};

export const cancelOrder = async (id: string) => {
  const response: AxiosResponse<ResponseType<Order>> = await axios.patch(
    `/orders/api/${id}/cancel-order`
  );
  return response.data;
};

export const getOrdersSummary = async () => {
  const response: AxiosResponse<ResponseType<OrderSummaryResponseTye>> =
    await axios.get("/orders/api/summary");
  return response.data;
};
