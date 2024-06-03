import { prisma } from "../src/lib/prisma";
async function main() {
  const orders = [
    {
      order_id: "ORD-1234567890-001",
      customer_name: "Alice Johnson",
      shipping_address: "123 Elm Street, Springfield",
      product_name: "Laptop",
      quantity: 1,
      price: 999.99,
      status: "Shipped",
      createdAt: new Date("2024-01-01T10:00:00Z"),
    },
    {
      order_id: "ORD-1234567890-002",
      customer_name: "Bob Smith",
      shipping_address: "456 Oak Street, Springfield",
      product_name: "Smartphone",
      quantity: 2,
      price: 699.99,
      status: "Processing",
      createdAt: new Date("2024-01-02T11:00:00Z"),
    },
    {
      order_id: "ORD-1234567890-003",
      customer_name: "Charlie Brown",
      shipping_address: "789 Pine Street, Springfield",
      product_name: "Tablet",
      quantity: 3,
      price: 499.99,
      status: "Delivered",
      createdAt: new Date("2024-01-03T12:00:00Z"),
    },
    {
      order_id: "ORD-1234567890-004",
      customer_name: "Diana Prince",
      shipping_address: "101 Maple Street, Springfield",
      product_name: "Headphones",
      quantity: 5,
      price: 199.99,
      status: "Cancelled",
      createdAt: new Date("2024-01-04T13:00:00Z"),
    },
    {
      order_id: "ORD-1234567890-005",
      customer_name: "Evan Davis",
      shipping_address: "202 Birch Street, Springfield",
      product_name: "Monitor",
      quantity: 1,
      price: 299.99,
      status: "Returned",
      createdAt: new Date("2024-01-05T14:00:00Z"),
    },
  ];

  for (let i = 0; i < 25; i++) {
    orders.push({
      order_id: `ORD-1234567890-${(i + 6).toString().padStart(3, "0")}`,
      customer_name: `Customer ${i + 1}`,
      shipping_address: `${i + 1} Cherry Lane, Springfield`,
      product_name: `Product ${i + 1}`,
      quantity: Math.floor(Math.random() * 10) + 1, // random quantity between 1 and 10
      price: parseFloat((Math.random() * 1000).toFixed(2)), // random price between 0.00 and 1000.00
      status: "Delivered",
      createdAt: new Date(
        `2024-01-${((i % 31) + 1).toString().padStart(2, "0")}T15:00:00Z`
      ),
    });
  }
  for (const order of orders) {
    await prisma.order.create({
      data: order,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
