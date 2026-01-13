export interface Topic {
  id: string
  course_id: string
  semester: string
  title: string
  description: string
  status: string
  created_at?: string
  updated_at?: string
}

export interface iTopic {
  id?: string
  course_id?: string
  semester?: string
  title?: string
  description?: string
  status?: string
}
