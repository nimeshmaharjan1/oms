"use client";
import { ListFilter, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ORDER_STATUS } from "@/lib/constants";
import { cn, formatPrice } from "@/lib/utils";
import type { ResponsePaginationType } from "@/types/global.types";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import CreateOrderCard from "./_components/create/card";
import OrderDetails from "./_components/order-details";
import SalesDetails from "./_components/sales-details";
import { useGetAllOrders } from "./_hooks/use-orders.hook";
import { useOrderStore } from "./_store";
import OrdersSummary from "./_components/orders-summary";

const OrdersPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const queryForm = useForm({
    defaultValues: {
      status: "",
      search: "",
      page: 1,
      limit: 10,
    },
  });
  const debouncedSearchTerm = useDebounce(queryForm.watch("search"), 300);
  const { order, setOrder } = useOrderStore();
  const query = useGetAllOrders({
    search: debouncedSearchTerm,
    status: queryForm.watch("status"),
    page: queryForm.watch("page"),
    limit: queryForm.watch("limit"),
  });

  const generatePaginationItems = (paginationData: ResponsePaginationType) => {
    const { current, totalPages } = paginationData;
    const pages = [];
    // Add previous button
    if (paginationData.prev !== null) {
      pages.push(
        <PaginationItem key="prev">
          <PaginationPrevious
            onClick={() => {
              if (!paginationData.prev) return;
              queryForm.setValue("page", paginationData.prev);
            }}
          />
        </PaginationItem>
      );
    }

    // Add current page and surrounding pages
    for (
      let page = Math.max(current - 2, 1);
      page <= Math.min(current + 2, totalPages);
      page++
    ) {
      pages.push(
        <PaginationItem key={page}>
          <PaginationLink
            onClick={() => {
              queryForm.setValue("page", page);
            }}
            isActive={current === page}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Add next button
    if (paginationData.next !== null) {
      pages.push(
        <PaginationItem key="next">
          <PaginationNext
            onClick={() => {
              if (!paginationData.next) return;
              queryForm.setValue("page", paginationData.next);
            }}
          />
        </PaginationItem>
      );
    }
    return pages;
  };

  //For hydration error on the table
  useEffect(() => {
    if (!window) return;
    setIsMounted(true);
  }, []);
  if (!isMounted) return;

  return (
    <main className="lg:grid flex-1 items-start space-y-4 lg:space-y-0 gap-4 p-4 sm:px-6 sm:py-0 md:gap-6 lg:grid-cols-3 xl:grid-cols-3">
      <div className="lg:grid space-y-3 lg:space-y-0 auto-rows-max items-start gap-4 md:gap-6 lg:col-span-2">
        <div className="lg:grid space-y-3 lg:space-y-0 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <CreateOrderCard></CreateOrderCard>
          <SalesDetails></SalesDetails>
        </div>
        <div className="hidden lg:block">
          <OrdersSummary />
        </div>
        <Tabs defaultValue="week">
          <div className="flex items-center">
            {/* <TabsList>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList> */}
            <div className="ml-auto flex items-center gap-2">
              <div className="relative ml-auto flex-1 md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Controller
                  control={queryForm.control}
                  name="search"
                  render={({ field }) => (
                    <Input
                      onChange={field.onChange}
                      value={field.value}
                      type="search"
                      placeholder="Search by Order ID, Customer, Product..."
                      className="w-72 rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                    />
                  )}
                ></Controller>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1 text-sm">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {Object.values(ORDER_STATUS).map((status) => (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={status === queryForm.watch("status")}
                      onClick={() => queryForm.setValue("status", status)}
                    >
                      {status}
                    </DropdownMenuCheckboxItem>
                  ))}
                  <Separator></Separator>
                  <DropdownMenuCheckboxItem
                    onClick={() => queryForm.setValue("status", "")}
                  >
                    Clear
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <TabsContent value="week">
            <Card x-chunk="dashboard-05-chunk-3">
              <CardHeader className="px-7">
                <CardTitle>Orders</CardTitle>
                <CardDescription>
                  Recent orders from your store.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[25%]">Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead className="">Status</TableHead>
                      <TableHead className="">Date</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {query.isLoading ? (
                      <div className="py-4">Loading...</div>
                    ) : query.isError ? (
                      <div className="py-4">
                        <p className="text-red-500">
                          Could not fetch the orders
                        </p>
                      </div>
                    ) : query.data && query.data.data.length === 0 ? (
                      <p className="text-medium py-4">
                        No orders found. Please try changing the filter or the
                        search.
                      </p>
                    ) : (
                      query.data?.data?.map((rowOrder) => (
                        <TableRow
                          key={rowOrder.id}
                          className={cn(
                            "cursor-pointer",
                            rowOrder.id === order?.id && "bg-accent"
                          )}
                          onClick={() => setOrder(rowOrder)}
                        >
                          <TableCell>
                            <div className="font-medium">
                              {rowOrder.order_id}
                            </div>
                            {/* <div className="hidden text-sm text-muted-foreground md:inline">
                            {rowOrder.customer_name}
                          </div> */}
                          </TableCell>
                          <TableCell className="">
                            {rowOrder.customer_name}
                          </TableCell>
                          <TableCell className="">
                            {rowOrder.product_name}
                          </TableCell>
                          <TableCell className=" font-medium">
                            {rowOrder.quantity}
                          </TableCell>
                          <TableCell className="">
                            <Badge
                              className="text-xs"
                              variant={
                                rowOrder.status === ORDER_STATUS.SHIPPED
                                  ? "default"
                                  : rowOrder.status === ORDER_STATUS.DELIVERED
                                  ? "success"
                                  : rowOrder.status === ORDER_STATUS.CANCELLED
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {rowOrder.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="">
                            {new Date(rowOrder.createdAt).toDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatPrice(rowOrder.price)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                {query.data?.pagination && (
                  <Pagination>
                    <PaginationContent>
                      {generatePaginationItems(query.data.pagination)}
                    </PaginationContent>
                  </Pagination>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      {order && <OrderDetails order={order}></OrderDetails>}
      <div className="block lg:hidden">
        <OrdersSummary />
      </div>
    </main>
  );
};

export default OrdersPage;
