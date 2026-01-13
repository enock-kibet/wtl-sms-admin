export interface Schools {
  id: string
  name: string
  dean?: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export interface iSchools {
  id?: string
  name: string
  dean?: string
  description?: string
  status: string
  created_at?: string
  updated_at?: string
}

export interface AcademicYear {
  id: string
  name: string
  description?: string
  icon?: string
  start_date: string
  end_date: string
  status: string
  created_at: string
  updated_at: string
}

export interface iAcademicYear {
  id?: string
  name: string
  description?: string
  start_date: string
  end_date: string
  icon?: File | null
  icon_url?: string
  status: string
  created_at?: string
  updated_at?: string
}
