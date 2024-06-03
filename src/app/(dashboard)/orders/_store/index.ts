import type { Order } from "@prisma/client";
import { create } from "zustand";

interface OrderState {
  order: Order | undefined;
  setOrder: (order: Order) => void;
}

export const useOrderStore = create<OrderState>()((set) => ({
  order: undefined,
  setOrder: (order) =>
    set({
      order,
    }),
}));
