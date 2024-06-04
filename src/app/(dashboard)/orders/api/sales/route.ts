import { prisma } from "@/lib/prisma";
import {
  endOfMonth,
  endOfWeek,
  formatISO,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Calculate start and end dates for the current week and the previous week
    const currentDate = new Date();
    const currentWeekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Assuming week starts on Monday
    const currentWeekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

    const previousWeekStart = startOfWeek(subWeeks(currentDate, 1), {
      weekStartsOn: 1,
    });
    const previousWeekEnd = endOfWeek(subWeeks(currentDate, 1), {
      weekStartsOn: 1,
    });

    // Calculate start and end dates for the current month and the previous month
    const currentMonthStart = startOfMonth(currentDate);
    const currentMonthEnd = endOfMonth(currentDate);

    const previousMonthStart = startOfMonth(subMonths(currentDate, 1));
    const previousMonthEnd = endOfMonth(subMonths(currentDate, 1));

    // Format dates to ISO strings for Prisma query
    const currentWeekStartStr = formatISO(currentWeekStart);
    const currentWeekEndStr = formatISO(currentWeekEnd);
    const previousWeekStartStr = formatISO(previousWeekStart);
    const previousWeekEndStr = formatISO(previousWeekEnd);

    const currentMonthStartStr = formatISO(currentMonthStart);
    const currentMonthEndStr = formatISO(currentMonthEnd);
    const previousMonthStartStr = formatISO(previousMonthStart);
    const previousMonthEndStr = formatISO(previousMonthEnd);

    // Query total sales for the current week
    const currentWeekSales = await prisma.order.aggregate({
      _sum: {
        price: true,
      },
      where: {
        createdAt: {
          gte: currentWeekStartStr,
          lte: currentWeekEndStr,
        },
      },
    });

    // Query total sales for the previous week
    const previousWeekSales = await prisma.order.aggregate({
      _sum: {
        price: true,
      },
      where: {
        createdAt: {
          gte: previousWeekStartStr,
          lte: previousWeekEndStr,
        },
      },
    });

    // Query total sales for the current month
    const currentMonthSales = await prisma.order.aggregate({
      _sum: {
        price: true,
      },
      where: {
        createdAt: {
          gte: currentMonthStartStr,
          lte: currentMonthEndStr,
        },
      },
    });

    // Query total sales for the previous month
    const previousMonthSales = await prisma.order.aggregate({
      _sum: {
        price: true,
      },
      where: {
        createdAt: {
          gte: previousMonthStartStr,
          lte: previousMonthEndStr,
        },
      },
    });

    // Calculate totals
    const currentWeekTotal = currentWeekSales._sum.price || 0;
    const previousWeekTotal = previousWeekSales._sum.price || 0;
    const currentMonthTotal = currentMonthSales._sum.price || 0;
    const previousMonthTotal = previousMonthSales._sum.price || 0;

    // Calculate percentage changes
    const weeklyPercentageChange =
      previousWeekTotal > 0
        ? ((currentWeekTotal - previousWeekTotal) / previousWeekTotal) * 100
        : 0;
    const monthlyPercentageChange =
      previousMonthTotal > 0
        ? ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100
        : 0;

    return Response.json({
      message: "Sales data fetched",
      data: {
        weekly: {
          currentTotal: currentWeekTotal.toFixed(2),
          percentageChange: weeklyPercentageChange.toFixed(2),
        },
        monthly: {
          currentTotal: currentMonthTotal.toFixed(2),
          percentageChange: monthlyPercentageChange.toFixed(2),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching the sales data:", error);
    return Response.json(
      {
        message: "Error fetching sales",
      },
      {
        status: 500,
      }
    );
  }
}
