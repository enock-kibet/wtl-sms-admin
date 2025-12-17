export interface Departments {
  id: string
  name: string
  dean?: string
  description?: string
  faculty_id?: string
  status: string
  created_at: string
  updated_at: string
}

export interface iDepartments {
  id?: string
  name?: string
  dean?: string
  faculty_id?: string
  description?: string
  status: string
  created_at?: string
  updated_at?: string
}
