"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateOrder from ".";
const CreateOrderCard = () => {
  return (
    <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
      <CardHeader className="pb-3">
        <CardTitle>Your Orders</CardTitle>
        <CardDescription className="max-w-lg text-balance leading-relaxed">
          Introducing Our Dynamic Orders Dashboard for Seamless Management and
          Insightful Analysis.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <CreateOrder></CreateOrder>
      </CardFooter>
    </Card>
  );
};

export default CreateOrderCard;
