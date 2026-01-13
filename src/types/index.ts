export interface Product {
  id: string;
  name: string;
  description: string | null;
  category: 'vegetable' | 'fruit';
  price: number;
  original_price?: number; // MRP before discount
  unit: string;
  image_url: string | null;
  farmer_id: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  role: 'farmer' | 'customer';
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  profile?: Profile;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

export interface Farm {
  id: string;
  name: string;
  description: string;
  image_url: string;
  rating: number;
  review_count: number;
  delivery_time: string;
  location: string;
  is_featured: boolean;
  specialty: string[];
}
