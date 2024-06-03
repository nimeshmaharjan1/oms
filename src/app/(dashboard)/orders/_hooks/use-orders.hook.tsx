import { useQuery } from "@tanstack/react-query";
import { getAllOrders } from "../_services";
import type { OrderStatusType } from "@/lib/constants";
import { useOrderStore } from "../_store";

export const useGetAllOrders = (params: {
  status?: OrderStatusType;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const { setOrder } = useOrderStore();
  const ordersQuery = useQuery(
    ["get-all-orders", params.search, params.status, params.limit, params.page],
    () =>
      getAllOrders({
        params,
      }),
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        setOrder(data.data?.[0]);
      },
    }
  );
  return ordersQuery;
};
