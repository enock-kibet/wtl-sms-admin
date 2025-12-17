export default [
  {
    title: 'Dashboard',
    to: { name: 'root' },
    icon: { icon: 'tabler-smart-home' },
  },

  {
    title: 'Schools',
    to: { name: 'schools' },
    icon: { icon: 'tabler-school' },
  },
  {
    title: 'Academic Years',
    to: { name: 'academic-years' },
    icon: { icon: 'tabler-calendar' },
  },
  {
    title: 'Departments',
    to: { name: 'departments' },
    icon: { icon: 'tabler-blocks' },
  },
  {
    title: 'Courses',
    to: { name: 'courses' },
    icon: { icon: 'tabler-vocabulary' },
  },
  {
    title: 'Classes',
    to: { name: 'classes' },
    icon: { icon: 'tabler-users-group' },
  },
  {
    title: 'Evaluations',
    to: { name: 'evaluations' },
    icon: { icon: 'tabler-edit' },
  },
  {
    title: 'Attendance Reports',
    to: { name: 'attendance-reports' },
    icon: { icon: 'tabler-checklist' },
  },
  {
    title: 'Users & Roles',
    icon: { icon: 'tabler-users' },
    children: [
      {
        title: 'Users & Roles',
        to: { name: 'users' },
      },
      {
        title: 'Roles & Permissions',
        to: { name: 'roles' },
      },
    ],
  },
  {
    title: 'My Profile',
    to: { name: 'my-profile' },
    icon: { icon: 'tabler-user-edit' },
  },
]
