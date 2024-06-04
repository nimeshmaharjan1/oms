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
  createOrderSchema,
  type CreateOrderSchemaType,
} from "../../_schemas/orders.schema";
import { createOrder } from "../../_services/orders.service";
import OrderFormData from "../form-data";
const CreateOrder = () => {
  const form = useForm<CreateOrderSchemaType>({
    resolver: zodResolver(createOrderSchema),
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
  const createOrderMutation = useMutation(
    (payload: CreateOrderSchemaType) => createOrder(payload),
    {
      onSuccess: (data) => {
        toast.success(data?.message);
        queryClient.invalidateQueries(["get-all-orders"]);
        queryClient.invalidateQueries(["get-sales-details"]);
        form.reset();
      },
      onError: (error: AxiosError<{ message: string }>) => {
        console.error(error?.response?.data);
        toast.error(
          error?.response?.data?.message ?? "Error while creating the order"
        );
      },
    }
  );
  const onSubmit: SubmitHandler<CreateOrderSchemaType> = (values) => {
    createOrderMutation.mutate(values);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create New Order</Button>
      </DialogTrigger>
      <DialogContent className="lg:max-w-screen-sm overflow-y-scroll lg:overflow-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
          <DialogDescription>
            Make changes to your order here. Click create when you are done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <OrderFormData type="create"></OrderFormData>
            <DialogFooter>
              <Button
                loading={createOrderMutation.isLoading}
                type="submit"
                className="mt-2"
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrder;
