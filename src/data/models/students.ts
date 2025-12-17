export interface Student {
  id: string
  name: string
  first_name: string
  last_name: string
  department_id: string
  faculty: string
  faculty_id?: string
  course_ids?: []
  attendance: string
  roles?: []
  academic_year: string
  status: string
  fails: string
}

export interface iStudent {
  id?: string
  name?: string
  first_name?: string
  last_name?: string
  phone?: string
  email?: string
  department_id?: string
  course_ids?: []
  reg_no?: string
  faculty?: string
  faculty_id?: string
  attendance?: string
  academic_year_id?: string
  status?: string
  fails?: string
}
