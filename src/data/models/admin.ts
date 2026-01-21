export interface DashStats {
  students: number
  instructors: number
  courses: number
  attendances: number
  class_list: string
  quality_grades: string
  fails: string
}

export interface AttendanceGraphModel {
  label: string
  count: number
}
