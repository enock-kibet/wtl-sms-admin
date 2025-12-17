import type { Courses } from './courses'
import type { AcademicYear } from './schools'

export interface Evaluation {
  id: string
  student: string
  course: Courses
  lecturer: string
  evaluation_type: string
  date: string
  score: string
  academic_year: AcademicYear
  department: string
  department_id?: string
  instructors?: string[]
  academic_year_id?: string
  description?: string
  attachments?: File[]
  status: string
  created_at: string
  updated_at: string
}

export interface iEvaluation {
  id?: string
  student_id: string
  course_id: string
  department_id?: string
  instructors?: string
  evaluation_type?: string
  date?: string
  score?: string
  academic_year_id?: string
  description?: string
  attachments?: File[]
  status: string
  created_at?: string
  updated_at?: string
}
