export interface OrderSummaryResponseTye {
  orderCounts: OrderCount[];
  revenue: number;
  topProducts: TopProduct[];
}

export interface OrderCount {
  _count: Count;
  status: string;
}

export interface Count {
  status: number;
}

export interface TopProduct {
  _sum: Sum;
  product_name: string;
}

export interface Sum {
  quantity: number;
}
