export interface Instructors {
  id: string
  name: string
  first_name?: string
  last_name?: string
  department_id?: string
  faculty: string
  faculty_id?: string
  attendance: string
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
  department_id?: string
  attendance?: string
  academic_year?: string
  status: string
}
