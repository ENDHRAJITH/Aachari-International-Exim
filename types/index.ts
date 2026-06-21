// Category
export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  is_active: boolean
  sort_order: number
  created_at: string
}

// Product Image
export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  alt_text: string | null
  is_primary: boolean
  sort_order: number
  created_at: string
}

// Product Spec
export interface ProductSpec {
  id: string
  product_id: string
  spec_key: string
  spec_value: string
  sort_order: number
}

// Product
export interface Product {
  id: string
  category_id: string | null
  name: string
  slug: string
  hsn_code: string | null
  description: string | null
  short_description: string | null
  is_active: boolean
  is_featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
  category?: Category
  images?: ProductImage[]
  specs?: ProductSpec[]
}

// Enquiry
export interface Enquiry {
  id: string
  product_id: string | null
  name: string
  email: string
  phone: string | null
  country: string | null
  city: string | null
  message: string | null
  status: 'new' | 'seen' | 'replied'
  created_at: string
  product?: Product
}

// Admin User
export interface AdminUser {
  id: string
  email: string
  password_hash: string
  role: 'admin' | 'editor'
  is_active: boolean
  created_at: string
}

// API Response
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Enquiry Form Input
export interface EnquiryInput {
  product_id: string
  name: string
  email: string
  phone: string
  country: string
  city: string
  message: string
}

// Admin Login Input
export interface LoginInput {
  email: string
  password: string
}

// Admin Token Payload
export interface TokenPayload {
  id: string
  email: string
  role: string
}

// Certificate
export interface Certificate {
  id: string
  name: string
  issued_by: string | null
  certificate_number: string | null
  image_url: string | null
  valid_until: string | null
  is_active: boolean
  sort_order: number
  created_at: string
}