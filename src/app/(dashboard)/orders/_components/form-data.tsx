import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { useFormContext } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ORDER_STATUS } from "@/lib/constants";
import { typeNumber } from "@/lib/utils";
import type { CreateOrderSchemaType } from "../_schemas/orders.schema";
const OrderFormData: React.FC<{
  type: "edit" | "create";
}> = ({ type }) => {
  const form = useFormContext<CreateOrderSchemaType>();
  return (
    <section className="space-y-3">
      <FormField
        control={form.control}
        name="product_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product</FormLabel>
            <FormControl>
              <Input placeholder="Product Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="customer_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Customer</FormLabel>
            <FormControl>
              <Input placeholder="Customer Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="shipping_address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Shipping Address</FormLabel>
            <FormControl>
              <Input placeholder="Address" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="quantity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quantity</FormLabel>
            <FormControl>
              <Input onKeyDown={typeNumber} placeholder="0" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input onKeyDown={typeNumber} placeholder="$0.00" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select the order status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.values(ORDER_STATUS).map((order) =>
                  type === "create" && order === ORDER_STATUS.CANCELLED ? (
                    <></>
                  ) : (
                    <SelectItem key={order} value={order}>
                      {order}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </section>
  );
};

export default OrderFormData;
