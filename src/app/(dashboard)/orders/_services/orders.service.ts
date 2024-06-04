import type { ResponseType } from "@/types/global.types";
import type { Order } from "@prisma/client";
import axios, { type AxiosResponse } from "axios";

export const getAllOrders = async ({
  params,
}: {
  params?: Record<string, any>;
}) => {
  const response: AxiosResponse<ResponseType<Order[]>> = await axios.get(
    "/orders/api",
    {
      // params: {
      //   customer_name: "customer 25",
      // },
      params,
    }
  );
  return response.data;
};
