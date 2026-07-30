export type AdminRole = 'master' | 'analyst' | 'support'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: AdminRole
}

export type VerificationStatus = 'APPROVED' | 'PENDING' | 'REJECTED'

export interface Merchant {
  id: string
  business_name: string
  business_type: string
  rif: string
  verification_status: VerificationStatus
  subscription_status: string | null
  tier: string | null
  level: number | null
  is_active: boolean
  latitude: number | null
  longitude: number | null
  distance_km: number | null
  approval_pct: number | null
  total_votes: number
  created_at: string
}

export interface MerchantListResponse {
  merchants: Merchant[]
  total: number
}

export interface User {
  id: string
  display_name: string
  email: string
  phone: string | null
  phone_verified: boolean
  role: string
  is_active: boolean
  created_at: string
}

export interface BcvRate {
  date: string
  rate_bs_per_usd: string
  source: string
  is_stale: boolean
}

export interface LedgerEntry {
  id: string
  transaction_id: string
  account_code: string
  direction: 'CREDIT' | 'DEBIT'
  amount: number
  currency: string
  created_at: string
  tx_type: string
  tx_status: string
}

export interface Ticket {
  id: string
  subject: string
  user_name: string
  user_type: 'user' | 'merchant'
  status: 'open' | 'in_progress' | 'resolved'
  priority: 'low' | 'medium' | 'high'
  created_at: string
  last_message: string
}

export interface ApprovalRequest {
  id: string
  type: 'merchant_rif' | 'recharge' | 'data_change'
  entity_name: string
  entity_id: string
  document_url: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  notes: string | null
}

export type TxStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'CONFLICTED'

export interface AdminMerchant {
  id: string
  business_name: string
  business_type: string
  rif: string
  email: string | null
  phone: string | null
  address: string | null
  verification_status: VerificationStatus
  subscription_status: string
  tier: string
  level: string
  is_active: boolean
  stars: number | null
  created_at: string
}

export interface AdminMerchantListResponse {
  merchants: AdminMerchant[]
  total: number
}

export interface AdminUserItem {
  id: string
  display_name: string | null
  email: string | null
  phone: string | null
  phone_verified: boolean
  role: string
  is_active: boolean
  auth_provider: string
  created_at: string
}

export interface AdminUserListResponse {
  users: AdminUserItem[]
  total: number
}

export interface AdminStats {
  total_users: number
  total_merchants: number
  approved_merchants: number
  pending_merchants: number
  active_users: number
}

export interface AuthState {
  token: string
  role: AdminRole
  name: string
}
