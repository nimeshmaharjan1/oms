import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const orderCounts = await prisma.order.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    const revenue = await prisma.order.aggregate({
      _sum: {
        price: true,
      },
      where: {
        status: "Delivered",
      },
    });

    const topProducts = await prisma.order.groupBy({
      by: ["product_name"],
      _sum: {
        quantity: true,
      },

      where: {
        status: "Delivered",
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 5, // Top 5 products
    });

    return Response.json({
      message: "Order summary fetched",
      data: {
        orderCounts,
        revenue: revenue._sum.price || 0,
        topProducts,
      },
    });
  } catch (error) {
    console.error("Error fetching order summary:", error);
    return Response.json(
      {
        message: "Error fetching order summary",
      },
      {
        status: 500,
      }
    );
  }
}
