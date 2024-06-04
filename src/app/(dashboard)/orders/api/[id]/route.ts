import { prisma } from "@/lib/prisma";
import type { ResponseType } from "@/types/global.types";
import {
  editOrderSchema,
  type EditOrderSchemaType,
} from "../../_schemas/orders.schema";
import type { Order } from "@prisma/client";

export async function GET(
  request: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
    });
    return Response.json({
      message: "Order fetched",
      data: order,
    } as ResponseType<Order>);
  } catch (error) {
    console.error("Error while fetching the order", error);
    return Response.json(
      {
        message: "Error while fetching the order",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  request: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const data: EditOrderSchemaType = await request.json();
    const response = editOrderSchema.safeParse(data);
    /**
     * Validate the request form data with zod
     */
    if (!response.success) {
      const { errors } = response.error;
      return Response.json(
        {
          error: { message: "Invalid request", errors },
        },
        {
          status: 400,
        }
      );
    }
    if (data?.id) {
      delete data.id;
    }
    const order = await prisma.order.update({
      where: {
        id,
      },
      data: {
        ...data,
        quantity: Number(data.quantity),
        price: Number(data.price),
        order_id: data.order_id,
      },
    });
    return Response.json({
      message: "Order has been updated",
      data: order,
    } as ResponseType<{}>);
  } catch (error) {
    console.error("Error while updating the order", error);
    return Response.json(
      {
        message: "Error while updating the order",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.delete({
      where: {
        id,
      },
    });
    return Response.json({
      message: "Order has been deleted",
      data: order,
    } as ResponseType<Order>);
  } catch (error) {
    console.error("Error while deleting the order", error);
    return Response.json(
      {
        message: "Error while deleting the order",
      },
      {
        status: 500,
      }
    );
  }
}
