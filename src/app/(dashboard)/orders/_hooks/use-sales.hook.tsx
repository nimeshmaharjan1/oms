import { useQuery } from "@tanstack/react-query";
import { getSalesDetails } from "../_services/sales-details.service";

export const useGetSalesDetails = () => {
  const salesQuery = useQuery(["get-sales-details"], getSalesDetails);
  return salesQuery;
};
