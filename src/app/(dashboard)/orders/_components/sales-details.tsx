"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGetSalesDetails } from "../_hooks/use-sales.hook";
import { formatPrice } from "@/lib/utils";
const SalesDetails = () => {
  const query = useGetSalesDetails();
  const weeklyTotal = Number(query.data?.data?.weekly?.currentTotal);
  const monthlyTotal = Number(query.data?.data?.monthly?.currentTotal);
  const weeklyPercentage = Number(query.data?.data?.weekly?.percentageChange);
  const monthlyPercentage = Number(query.data?.data?.monthly?.percentageChange);
  if (!query.data || query.isLoading) return <>Loading...</>;
  return (
    <>
      <Card x-chunk="dashboard-05-chunk-1">
        <CardHeader className="pb-2">
          <CardDescription>This Week</CardDescription>
          <CardTitle className="text-3xl">{formatPrice(weeklyTotal)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            +{weeklyPercentage}% from last week
          </div>
        </CardContent>
        <CardFooter>
          <Progress
            value={weeklyPercentage > 100 ? 100 : weeklyPercentage}
            aria-label={`${weeklyPercentage}% increase`}
          />
        </CardFooter>
      </Card>
      <Card x-chunk="dashboard-05-chunk-2">
        <CardHeader className="pb-2">
          <CardDescription>This Month</CardDescription>
          <CardTitle className="text-3xl">
            {" "}
            {formatPrice(monthlyTotal)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            +{monthlyPercentage}% from last month
          </div>
        </CardContent>
        <CardFooter>
          <Progress
            value={monthlyPercentage > 100 ? 100 : monthlyPercentage}
            aria-label={`${monthlyPercentage}% increase`}
          />
        </CardFooter>
      </Card>
    </>
  );
};

export default SalesDetails;
