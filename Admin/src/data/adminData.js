export const stats = [
  { label: "Revenue", value: "$28,430", trend: "+12.4%" },
  { label: "Orders", value: "1,248", trend: "+8.2%" },
  { label: "Products", value: "186", trend: "+14" },
  { label: "Customers", value: "5,420", trend: "+6.8%" },
];

export const products = [
  {
    id: 1,
    name: "Aero Buds Pro",
    category: "Audio",
    stock: 48,
    price: 129,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 2,
    name: "Nova X Smartphone",
    category: "Phones",
    stock: 22,
    price: 899,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 3,
    name: "Studio Max Headphones",
    category: "Audio",
    stock: 15,
    price: 249,
    status: "Low stock",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 4,
    name: "BladeBook Air 14",
    category: "Laptops",
    stock: 11,
    price: 1399,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 5,
    name: "Vision 4K Monitor",
    category: "Displays",
    stock: 0,
    price: 449,
    status: "Draft",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=300&q=80",
  },
];

export const orders = [
  {
    id: "TRX-2048",
    customer: "Ayesha Khan",
    items: "Aero Buds Pro, Nova X Smartphone",
    total: 1028,
    payment: "Paid",
    status: "Processing",
    date: "May 1, 2026",
  },
  {
    id: "TRX-2047",
    customer: "Hamza Ali",
    items: "BladeBook Air 14",
    total: 1399,
    payment: "Paid",
    status: "Shipped",
    date: "Apr 30, 2026",
  },
  {
    id: "TRX-2046",
    customer: "Sara Malik",
    items: "Studio Max Headphones",
    total: 249,
    payment: "COD",
    status: "Pending",
    date: "Apr 30, 2026",
  },
  {
    id: "TRX-2045",
    customer: "Usman Raza",
    items: "Vision 4K Monitor, Aero Buds Pro",
    total: 578,
    payment: "Paid",
    status: "Delivered",
    date: "Apr 29, 2026",
  },
];

export const categories = ["Phones", "Laptops", "Audio", "Gaming", "Watches", "Cameras", "Displays"];
