export interface Classes {
  id: string
  title: string
  course_code: string
  department_id?: string
  scheduled_at: string
  duration: string
  instructor_id?: string
  academic_year_id?: string
  course_id?: string
  description?: string
  link?: string
  attachments?: File[]
  status: string
  created_at: string
  updated_at: string
}

export interface iClasses {
  id?: string
  title: string
  course_code: string
  department_id?: string
  instructor_id?: string
  scheduled_at: string
  duration: string
  academic_year_id?: string
  description?: string
  attachments?: File[]
  course_id?: string
  link?: string
  status: string
  created_at?: string
  updated_at?: string
}
