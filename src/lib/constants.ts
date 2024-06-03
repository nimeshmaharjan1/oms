export const ORDER_STATUS = {
  SHIPPED: "Shipped",
  PROCESSING: "Processing",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export type OrderStatusType = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
