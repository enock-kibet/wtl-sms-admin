export const submitCourse = async (
  courseData: FormData,
  errors: Ref<Record<string, string | undefined>>,
) => {
  errors.value = {
    course_code: undefined,
    school_id: undefined,
    name: undefined,
    department_id: undefined,
    description: undefined,
    academic_year_id: undefined,
    instructor_id: undefined,
    status: undefined,
    attachments: undefined,
  } // reset

  try {
    return await $api('/course/create', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: courseData,
      onResponseError({ response }) {
        if (response._data?.errors)
          errors.value = response._data.errors
      },
    })
  }
  catch (e) {
    console.error(e)
    showToast('An error occurred while submitting the course data.', 'error')

    return null
  }
}

export const updateCourse = async (courseId: string, courseData: FormData, errors: Ref<Record<string, string | undefined>>) => {
  try {
    return await $api(`/course/update/${courseId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: courseData,
      onResponseError({ response }) {
        errors.value = response._data.errors
      },
    })
  }
  catch (err) {
    console.error(err)
    showToast('An error occurred while updating the course data.', 'error')

    return null
  }
}
