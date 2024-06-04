import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ORDER_STATUS } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import {
  editOrderSchema,
  type EditOrderSchemaType,
} from "../../_schemas/orders.schema";
import { editOrder } from "../../_services/orders.service";
import OrderFormData from "../form-data";
import { useGetSingleOrder } from "../../_hooks/use-orders.hook";
import { useEffect, useState, type FC } from "react";
import { Loader2, Pencil } from "lucide-react";
import { useOrderStore } from "../../_store";
const EditOrder: FC<{ id: string }> = ({ id }) => {
  const { setOrder } = useOrderStore();
  const [showDialog, setShowDialog] = useState(false);
  const form = useForm<EditOrderSchemaType>({
    resolver: zodResolver(editOrderSchema),
    defaultValues: {
      customer_name: "",
      price: "",
      product_name: "",
      quantity: "",
      shipping_address: "",
      status: ORDER_STATUS.PROCESSING,
    },
  });
  const queryClient = useQueryClient();
  const orderQuery = useGetSingleOrder(id);
  useEffect(() => {
    if (!orderQuery.data) return;
    const data = orderQuery.data.data;
    form.setValue("customer_name", data.customer_name);
    form.setValue("product_name", data.product_name);
    form.setValue("id", id);
    form.setValue("order_id", data.order_id);
    form.setValue("price", data.price.toString());
    form.setValue("quantity", data.quantity.toString());
    form.setValue("shipping_address", data.shipping_address);
    form.setValue("status", data.status);
  }, [id, orderQuery.data]);
  const editOrderMutation = useMutation(
    (payload: EditOrderSchemaType) => editOrder(payload),
    {
      onSuccess: (data) => {
        toast.success(data?.message);
        queryClient.invalidateQueries(["get-all-orders"]);
        queryClient.invalidateQueries(["get-single-order"]);
        queryClient.invalidateQueries(["get-sales-details"]);

        setOrder(data.data);
        setShowDialog(false);
      },
      onError: (error: AxiosError<{ message: string }>) => {
        console.error(error?.response?.data);
        toast.error(
          error?.response?.data?.message ?? "Error while updating the order"
        );
      },
    }
  );
  const onSubmit: SubmitHandler<EditOrderSchemaType> = (values) => {
    editOrderMutation.mutate(values);
  };
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 gap-2">
          <Pencil className="h-3.5 w-3.5" />
          <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
            Edit Order
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="lg:max-w-screen-sm overflow-y-scroll lg:overflow-auto max-h-screen">
        {orderQuery.isLoading ? (
          <div className="h-96 flex items-center justify-center gap-2">
            <Loader2 className="animate-spin"></Loader2>
            Loading...
          </div>
        ) : orderQuery.isError ? (
          <div className="h-96 flex items-center justify-center gap-2">
            <p className="text-destructive font-bold">
              Something went wrong while trying to fetch the order
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>
                Edit Order {orderQuery.data?.data?.order_id}
              </DialogTitle>
              <DialogDescription>
                Make changes to your order here. Click save when you are done.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3"
              >
                <OrderFormData type="edit"></OrderFormData>
                <DialogFooter>
                  <Button
                    loading={editOrderMutation.isLoading}
                    type="submit"
                    className="mt-2"
                  >
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditOrder;
