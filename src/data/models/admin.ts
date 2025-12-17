export interface DashStats {
  students: number
  instructors: number
  courses: number
  attendances: number
  graduates: string
  quality_grades: string
  fails: string
}

export interface AttendanceGraphModel {
  label: string
  count: number
}
