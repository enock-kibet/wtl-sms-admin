export interface Permission {
  id: number
  name: string
  label: string
  action: string
  module: string
  checked?: boolean
  guard_name: string
  created_at?: string
  updated_at?: string
}

export interface User {
  id: number
  first_name: string
  last_name: string
  email?: string

  // add other fields if needed
}

export interface Role {
  id?: number
  name: string
  guard: 'admin' | 'instructor' | 'student' | null
  permissions: string[]
  users?: {
    admins: User[]
    instructors: User[]
    students: User[]
  }
  created_at?: string
  updated_at?: string
}
