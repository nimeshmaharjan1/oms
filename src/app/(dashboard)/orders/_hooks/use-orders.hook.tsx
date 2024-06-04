import { useQuery } from "@tanstack/react-query";
import { getAllOrders, getSingleOrder } from "../_services/orders.service";
import type { OrderStatusType } from "@/lib/constants";
import { useOrderStore } from "../_store";

export const useGetAllOrders = (params: {
  status?: OrderStatusType;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const { setOrder, order } = useOrderStore();
  const ordersQuery = useQuery(
    ["get-all-orders", params.search, params.status, params.limit, params.page],
    () =>
      getAllOrders({
        params,
      }),
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        if (order?.id) return;
        setOrder(data.data?.[0]);
      },
    }
  );
  return ordersQuery;
};
export const useGetSingleOrder = (id: string) => {
  const orderQuery = useQuery(["get-single-order", id], () =>
    getSingleOrder(id)
  );
  return orderQuery;
};
