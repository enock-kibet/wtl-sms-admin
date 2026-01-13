export interface Instructors {
  id: string
  name: string
  first_name?: string
  last_name?: string
  school_id?: string
  department_id?: string
  faculty: string
  faculty_id?: string
  attendance: string
  employment_type: string
  roles?: []
  title: string
  pf_number: string
  academic_year: string
  status: string
}

export interface iInstructors {
  id?: string
  name?: string
  first_name?: string
  last_name?: string
  phone?: string
  pf_number?: string
  title?: string
  email?: string
  employment_type?: string
  faculty_id?: string
  department_id?: string
  attendance?: string
  academic_year?: string
  status: string
}
