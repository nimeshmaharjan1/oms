"use client";

import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  MoreVertical,
  Truck,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { useOrderStore } from "../_store";
import { formatPrice } from "@/lib/utils";
import EditOrder from "./edit";
import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS } from "@/lib/constants";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelOrder, deleteOrder } from "../_services/orders.service";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { Order } from "@prisma/client";

const OrderDetails: React.FC<{ order: Order }> = ({ order }) => {
  const [showCancel, setShowCancel] = useState(false);
  const [showTrash, setShowTrash] = useState(false);
  const { setOrder } = useOrderStore();
  const queryClient = useQueryClient();
  const cancelMutation = useMutation((id: string) => cancelOrder(id), {
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(["get-all-orders"]);
      queryClient.invalidateQueries(["get-single-order"]);
      queryClient.invalidateQueries(["get-sales-details"]);
      setOrder(data?.data);
      setShowCancel(false);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error?.response?.data?.message ??
          "Error while trying to cancel the order"
      );
    },
  });
  const trashMutation = useMutation((id: string) => deleteOrder(id), {
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(["get-all-orders"]);
      queryClient.invalidateQueries(["get-single-order"]);
      queryClient.invalidateQueries(["get-sales-details"]);
      setShowTrash(false);
      setOrder(undefined);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error?.response?.data?.message ??
          "Error while trying to delete the order"
      );
    },
  });
  if (!order) return <>Loading...</>;
  return (
    <div>
      <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              Order {order?.order_id}
            </CardTitle>
            <CardDescription>
              Date:{" "}
              {order?.createdAt && new Date(order?.createdAt).toLocaleString()}
            </CardDescription>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <EditOrder id={order.id}></EditOrder>

            {/* <Button disabled size="sm" variant="outline" className="h-8 gap-1">
              <Truck className="h-3.5 w-3.5" />
              <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                Track Order
              </span>
            </Button> */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" className="h-8 w-8">
                  <MoreVertical className="h-3.5 w-3.5" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* <DropdownMenuItem>Export</DropdownMenuItem> */}
                <DropdownMenuItem
                  onClick={() => {
                    setShowCancel(true);
                  }}
                >
                  Cancel
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setShowTrash(true);
                  }}
                >
                  Trash
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-sm">
          <div className="grid gap-3">
            <div className="font-semibold">Order Details</div>
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {order?.product_name} x <span>{order?.quantity}</span>
                </span>
                <span>{formatPrice(order?.price)}</span>
              </li>
            </ul>
            <section className="flex">
              <Badge
                variant={
                  order?.status === ORDER_STATUS.SHIPPED
                    ? "default"
                    : order?.status === ORDER_STATUS.DELIVERED
                    ? "success"
                    : order?.status === ORDER_STATUS.CANCELLED
                    ? "destructive"
                    : "secondary"
                }
              >
                {order?.status}
              </Badge>
            </section>
            <Separator className="my-2" />
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order?.price)}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>$0.00</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>$0.00</span>
              </li>
              <li className="flex items-center justify-between font-semibold">
                <span className="text-muted-foreground">Total</span>
                <span>{formatPrice(order?.price)}</span>
              </li>
            </ul>
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-3">
              <div className="font-semibold">Shipping Information</div>
              <address className="grid gap-0.5 not-italic text-muted-foreground">
                <span>{order?.shipping_address}</span>
              </address>
            </div>
            <div className="grid auto-rows-max gap-3">
              <div className="font-semibold">Billing Information</div>
              <div className="text-muted-foreground">
                Same as shipping address
              </div>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="grid gap-3">
            <div className="font-semibold">Customer Information</div>
            <dl className="grid gap-3">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Customer</dt>
                <dd>{order?.customer_name}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Email</dt>
                <dd>
                  <a href="mailto:">liam@acme.com</a>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Phone</dt>
                <dd>
                  <a href="tel:">+1 234 567 890</a>
                </dd>
              </div>
            </dl>
          </div>
          <Separator className="my-4" />
          <div className="grid gap-3">
            <div className="font-semibold">Payment Information</div>
            <dl className="grid gap-3">
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1 text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  Visa
                </dt>
                <dd>**** **** **** 4532</dd>
              </div>
            </dl>
          </div>
        </CardContent>
        <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
          <div className="text-xs text-muted-foreground">
            Updated{" "}
            <time dateTime="2023-11-23">
              {order?.updatedAt && new Date(order?.updatedAt).toLocaleString()}
            </time>
          </div>
        </CardFooter>
      </Card>
      <AlertDialog open={showCancel} onOpenChange={setShowCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will change the status of this order to{" "}
              <strong>cancelled</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              loading={cancelMutation.isLoading}
              variant={"destructive"}
              onClick={() => cancelMutation.mutate(order.id)}
            >
              Continue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showTrash} onOpenChange={setShowTrash}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              order.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              loading={trashMutation.isLoading}
              variant={"destructive"}
              onClick={() => trashMutation.mutate(order.id)}
            >
              Continue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OrderDetails;
