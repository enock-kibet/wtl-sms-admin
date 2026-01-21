import type { Instructors } from './instructors'

export interface Courses {
  id: string
  name: string
  course_code: string
  department_id?: string
  instructors?: string[]
  academic_year_id?: string
  description?: string
  attachments?: File[]
  lecturer?: Instructors[]
  status: string
  created_at: string
  updated_at: string
}

export interface iCourses {
  id?: string
  name: string
  course_code: string
  school_id?: string
  department_id?: string
  instructors?: string[]
  academic_year_id?: string
  description?: string
  attachments?: File[]
  status: string
  created_at?: string
  updated_at?: string
}
