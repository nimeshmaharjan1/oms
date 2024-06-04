import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { getOrdersSummary } from "../_services/orders.service";
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
import type { OrderCount } from "../_types/order-summary.types";

const OrdersSummary = () => {
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
      <Card className="col-span-5 xl:col-span-3">
        <CardHeader>
          <CardTitle>Orders Count</CardTitle>
          <CardDescription>
            A line chart displaying the count of orders by status (e.g.,
            Delivered, Shipped, Processing) to track order distribution and
            trends.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 pr-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={orderCounts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.colors.background,
                }}
                labelStyle={{
                  color: theme.colors.primary.DEFAULT,
                }}
                itemStyle={{ color: theme.colors.primary.DEFAULT }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke={theme.colors.primary.DEFAULT}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="col-span-5 xl:col-span-2">
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

export default OrdersSummary;
