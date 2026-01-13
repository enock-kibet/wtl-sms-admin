export interface Classes {
  id: string
  course_code: string
  department_id?: string
  scheduled_at: string
  semester?: string
  duration: string
  instructor_id?: string
  course_id?: string
  topic_id?: string
  description?: string
  inst_employment_type?: string
  link?: string
  attachments?: File[]
  status: string
  created_at: string
  updated_at: string
}

export interface iClasses {
  id?: string
  title?: string
  topic_id?: string
  course_code?: string
  department_id?: string
  instructor_id?: string
  scheduled_at?: string
  semester?: string
  duration?: string
  inst_employment_type?: string
  description?: string
  attachments?: File[]
  course_id?: string
  link?: string
  status?: string
}
