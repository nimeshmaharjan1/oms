import { prisma } from "../src/lib/prisma";
async function main() {
  const orders = [
    {
      order_id: "ORD-1234567890-001",
      customer_name: "Alice Johnson",
      shipping_address: "123 Elm Street, Springfield",
      product_name: "Laptop",
      quantity: 1,
      price: 299.99,
      status: "Shipped",
      createdAt: new Date("2024-05-05T10:00:00Z"),
    },
    {
      order_id: "ORD-1234567890-002",
      customer_name: "Bob Smith",
      shipping_address: "456 Oak Street, Springfield",
      product_name: "Smartphone",
      quantity: 2,
      price: 199.99,
      status: "Processing",
      createdAt: new Date("2024-05-02T11:00:00Z"),
    },
    {
      order_id: "ORD-1234567890-003",
      customer_name: "Charlie Brown",
      shipping_address: "789 Pine Street, Springfield",
      product_name: "Tablet",
      quantity: 3,
      price: 299.99,
      status: "Delivered",
      createdAt: new Date("2024-05-03T12:00:00Z"),
    },
    {
      order_id: "ORD-1234567890-004",
      customer_name: "Diana Prince",
      shipping_address: "105 Maple Street, Springfield",
      product_name: "Headphones",
      quantity: 5,
      price: 199.99,
      status: "Cancelled",
      createdAt: new Date("2024-05-04T13:00:00Z"),
    },
    {
      order_id: "ORD-1234567890-005",
      customer_name: "Evan Davis",
      shipping_address: "202 Birch Street, Springfield",
      product_name: "Monitor",
      quantity: 1,
      price: 299.99,
      status: "Returned",
      createdAt: new Date("2024-05-05T14:00:00Z"),
    },
    {
      order_id: "ORD-20240604-041642-820",
      customer_name: "Aava Adhikari",
      shipping_address: "202 Birch Street, Springfield",
      product_name: "Monitors",
      quantity: 20,
      price: 4000.22,
      status: "Delivered",
      createdAt: new Date("2024-06-03T22:34:39.430Z"),
    },
    {
      order_id: "ORD-20240605-041642-671",
      customer_name: "Nimesh Maharjan",
      shipping_address: "202 Birch Street, Springfield",
      product_name: "Monitors",
      quantity: 20,
      price: 3302.22,
      status: "Delivered",
      createdAt: new Date("2024-06-04T22:34:39.430Z"),
    },
    {
      order_id: "ORD-20240529-041642-823",
      customer_name: "Nimesh Maharjan",
      shipping_address: "202 Birch Street, Springfield",
      product_name: "Monitors",
      quantity: 20,
      price: 1500,
      status: "Delivered",
      createdAt: new Date("2024-05-29T22:34:39.430Z"),
    },
    {
      order_id: "ORD-20240528-041642-820",
      customer_name: "Nimesh Maharjan",
      shipping_address: "202 Birch Street, Springfield",
      product_name: "Laptops",
      quantity: 20,
      price: 1500,
      status: "Delivered",
      createdAt: new Date("2024-05-28T22:34:39.430Z"),
    },
    {
      order_id: "ORD-20240605-041642-821",
      customer_name: "Joe Dunphy",
      shipping_address: "202 Birch Street, Springfield",
      product_name: "Iphone",
      quantity: 12,
      price: 1500.2,
      status: "Shipped",
      createdAt: new Date("2024-06-05T22:34:39.430Z"),
    },
    {
      order_id: "ORD-20240603-041642-822",
      customer_name: "Hailey Prichett",
      shipping_address: "202 Birch Street, Springfield",
      product_name: "Iphone",
      quantity: 2,
      price: 500.2,
      status: "Shipped",
      createdAt: new Date("2024-06-03T22:34:39.430Z"),
    },
    {
      order_id: "ORD-20240526-041642-729",
      customer_name: "Phil Dunphy",
      shipping_address: "202 Birch Street, Springfield",
      product_name: "Iphone",
      quantity: 20,
      price: 2000,
      status: "Delivered",
      createdAt: new Date("2024-05-26T22:34:39.430Z"),
    },
    {
      order_id: "ORD-20240616-041642-729",
      customer_name: "Jay Dunphy",
      shipping_address: "202 Birch Street, Springfield",
      product_name: "Iphone",
      quantity: 2,
      price: 1000,
      status: "Delivered",
      createdAt: new Date("2024-06-16T22:34:39.430Z"),
    },
  ];

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
