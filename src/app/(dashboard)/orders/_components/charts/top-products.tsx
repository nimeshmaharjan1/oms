import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { useTheme } from "next-themes";
import useTailwind from "@/hooks/use-tailwind.hook";
import type { OrderCount } from "../../_types/order-summary.types";
import { getOrdersSummary } from "../../_services/orders.service";

const TopProducts = () => {
  const { theme } = useTailwind();
  const query = useQuery(["get-order-summary"], getOrdersSummary);
  const [orderCounts, setOrderCounts] = useState<OrderCount[]>([]);
  useEffect(() => {
    if (!query.data) return;
    const data = query.data.data;
    const transformedOrderCounts = data.orderCounts.map((item) => ({
      ...item,
      count: item._count.status,
    }));
    setOrderCounts(transformedOrderCounts);
  }, [query.data]);
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];
  if (query.isLoading) return <>Loading...</>;
  return (
    <div className="grid grid-cols-5 gap-3">
      <Card className="col-span-5">
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
          <CardDescription>
            A pie chart showing the top products by quantity sold, highlighting
            the most popular items.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={query.data?.data.topProducts}
                dataKey="_sum.quantity"
                nameKey="product_name"
                labelLine={false}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {query.data?.data.topProducts?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopProducts;
