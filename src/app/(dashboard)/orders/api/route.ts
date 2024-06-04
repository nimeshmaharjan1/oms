import { prisma } from "@/lib/prisma";
import { generateOrderId } from "@/lib/utils";
import type { ResponseType } from "@/types/global.types";
import type { Order } from "@prisma/client";
import type { NextRequest } from "next/server";
import {
  createOrderSchema,
  type CreateOrderSchemaType,
} from "../_schemas/orders.schema";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    // const order_id = searchParams.get("order_id");
    // const customer_name = searchParams.get("customer_name");
    const status = searchParams.get("status");

    const searchQuery = searchParams.get("search");

    const filters = {} as any;

    if (searchQuery) {
      // Combine conditions for order_id and customer_name
      filters.OR = [
        { order_id: { contains: searchQuery } },
        { customer_name: { contains: searchQuery } },
        { product_name: { contains: searchQuery } },
      ];
    }
    // if (order_id) {
    //   filters.order_id = order_id;
    // }
    // if (customer_name) {
    //   filters.customer_name = {
    //     contains: customer_name,
    //   };
    // }
    if (status) {
      filters.status = status;
    }

    const totalCount = await prisma.order.count({
      where: filters,
    });

    const totalPages = Math.ceil(totalCount / limit);

    const orders = await prisma.order.findMany({
      where: filters,
      skip: skip,
      take: limit,
      orderBy: {
        createdAt: "desc", // Example ordering, adjust as needed
      },
    });

    const pagination = {
      current: page,
      next: page < totalPages ? page + 1 : null,
      prev: page > 1 ? page - 1 : null,
      totalCount: totalCount,
      totalPages: totalPages,
      limit: limit,
    };
    return Response.json({
      message: "Orders fetched",
      data: orders,
      pagination,
      filters,
    } as ResponseType<Order[]>);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return Response.json(
      {
        message: "Error fetching orders",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data: CreateOrderSchemaType = await request.json();
    const response = createOrderSchema.safeParse(data);
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
    const order = await prisma.order.create({
      data: {
        ...data,
        quantity: Number(data.quantity),
        price: Number(data.price),
        order_id: generateOrderId(),
      },
    });
    return Response.json({
      message: "Order has been created",
      data: order,
    } as ResponseType<{}>);
  } catch (error) {
    console.error("Error while creating the order", error);
    return Response.json(
      {
        message: "Error while creating the order",
      },
      {
        status: 500,
      }
    );
  }
}
