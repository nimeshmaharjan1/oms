import type { ResponseType } from "@/types/global.types";
import axios, { type AxiosResponse } from "axios";

export const getSalesDetails = async () => {
  const response: AxiosResponse<
    ResponseType<{
      weekly: {
        percentageChange: string;
        currentTotal: string;
      };
      monthly: {
        percentageChange: string;
        currentTotal: string;
      };
    }>
  > = await axios.get("/orders/api/sales");
  return response.data;
};
