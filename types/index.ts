export type ProductCategory = "handbags" | "shoes" | "clothes" | "sunglasses";

export interface Product {
  _id: string;
  name: string;
  slug: string;              // queries project slug.current → plain string
  category: ProductCategory;
  price: number;
  compareAtPrice?: number;
  images: SanityImage[];
  description?: string;
  stock: number;
  isFeatured?: boolean;
  sizes?: string[];
  colors?: ProductColor[];
  materials?: string;
  careInstructions?: string;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface SanityImage {
  _key?: string;
  asset?: {
    _ref: string;
    _type: "reference";
  } | null;
  alt?: string;
  /** Present on images seeded via _sanityAsset mutation directive */
  _sanityAsset?: string;
}

export interface Collection {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  image: SanityImage;
  season?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
  slug: string;
  category: ProductCategory;
}

export interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  stripePaymentIntentId?: string;
  shippingAddress: Address;
  createdAt: string;
}

export interface Address {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  addresses?: Address[];
  createdAt: string;
}
