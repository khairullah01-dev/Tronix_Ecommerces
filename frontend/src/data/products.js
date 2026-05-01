import {
  IoCameraOutline,
  IoGameControllerOutline,
  IoHeadsetOutline,
  IoLaptopOutline,
  IoPhonePortraitOutline,
  IoTabletLandscapeOutline,
  IoTvOutline,
  IoWatchOutline,
} from "react-icons/io5";

export const categories = [
  { name: "Phones", icon: IoPhonePortraitOutline },
  { name: "Laptops", icon: IoLaptopOutline },
  { name: "Audio", icon: IoHeadsetOutline },
  { name: "Gaming", icon: IoGameControllerOutline },
  { name: "Watches", icon: IoWatchOutline },
  { name: "Cameras", icon: IoCameraOutline },
  { name: "Tablets", icon: IoTabletLandscapeOutline },
  { name: "Displays", icon: IoTvOutline },
];

export const products = [
  {
    id: 1,
    name: "Aero Buds Pro",
    category: "Audio",
    price: 129,
    oldPrice: 169,
    rating: 4.8,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&w=700&q=80",
    ],
    description:
      "Compact wireless earbuds with active noise cancellation, low-latency mode, and all-day comfort.",
  },
  {
    id: 2,
    name: "Nova X Smartphone",
    category: "Phones",
    price: 899,
    oldPrice: 1049,
    rating: 4.9,
    badge: "Sale",
    image:
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=700&q=80",
    ],
    description:
      "Flagship phone with a bright OLED display, triple camera system, and fast charging.",
  },
  {
    id: 3,
    name: "Studio Max Headphones",
    category: "Audio",
    price: 249,
    oldPrice: 299,
    rating: 4.7,
    badge: "Hot",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=700&q=80",
    ],
    description:
      "Over-ear headphones tuned for immersive sound, soft cushions, and focused listening.",
  },
  {
    id: 4,
    name: "Pulse Smart Watch",
    category: "Watches",
    price: 199,
    oldPrice: 249,
    rating: 4.6,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1544117518-2b041724939d?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=700&q=80",
    ],
    description:
      "Everyday smartwatch with fitness tracking, calls, notifications, and a long-lasting battery.",
  },
  {
    id: 5,
    name: "BladeBook Air 14",
    category: "Laptops",
    price: 1399,
    oldPrice: 1599,
    rating: 4.9,
    badge: "Best",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=700&q=80",
    ],
    description:
      "Thin performance laptop for creators, students, and professionals who need power on the move.",
  },
  {
    id: 6,
    name: "Vision 4K Monitor",
    category: "Displays",
    price: 449,
    oldPrice: 529,
    rating: 4.5,
    badge: "Sale",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1593640495393-23196b27a87f?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=700&q=80",
    ],
    description:
      "Sharp 4K display with color-accurate panels, slim bezels, and comfort-focused viewing.",
  },
  {
    id: 7,
    name: "Capture Mini Camera",
    category: "Cameras",
    price: 679,
    oldPrice: 749,
    rating: 4.4,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1495707902641-75cac588d2e9?auto=format&fit=crop&w=700&q=80",
    ],
    description:
      "Mirrorless camera kit for travel, product photos, vlogging, and sharp everyday captures.",
  },
  {
    id: 8,
    name: "Arcade Pro Controller",
    category: "Gaming",
    price: 89,
    oldPrice: 119,
    rating: 4.6,
    badge: "Hot",
    image:
      "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=700&q=80",
    ],
    description:
      "Precise wireless controller with textured grips, custom buttons, and fast device switching.",
  },
];

export const blogPosts = [
  {
    id: 1,
    title: "How to choose headphones for work, gaming, and travel",
    category: "Buying Guide",
    image:
      "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    title: "Five laptop upgrades that matter for creators",
    category: "Laptops",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    title: "Smart home essentials that are actually useful",
    category: "Smart Home",
    image:
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=900&q=80",
  },
];
