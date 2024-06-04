import { ORDER_STATUS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import type { ResponseType } from "@/types/global.types";
import type { Order } from "@prisma/client";
export async function PATCH(
  request: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.update({
      where: {
        id,
      },
      data: {
        status: ORDER_STATUS.CANCELLED,
      },
    });
    return Response.json({
      message: "Order has been cancelled",
      data: order,
    } as ResponseType<Order>);
  } catch (error) {
    console.error("Error while cancelling the order", error);
    return Response.json(
      {
        message: "Error while cancelling the order",
      },
      {
        status: 500,
      }
    );
  }
}
