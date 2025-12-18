export const submitClass = async (
  classData: FormData,
  errors: Ref<Record<string, string | undefined>>,
) => {
  errors.value = {
    class_code: undefined,
    name: undefined,
    department_id: undefined,
    description: undefined,
    academic_year_id: undefined,
    instructor_id: undefined,
    status: undefined,
    attachments: undefined,
  } // reset

  try {
    return await $api('/class/create', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: classData,
      onResponseError({ response }) {
        if (response._data?.errors) {
          errors.value = response._data.errors
          showToast(response._data.message, 'error')
        }
      },
    })
  }
  catch (e) {
    console.error(e)

    return null
  }
}

export const updateClass = async (classId: string, classData: FormData, errors: Ref<Record<string, string | undefined>>) => {
  try {
    return await $api(`/class/update/${classId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: classData,
      onResponseError({ response }) {
        errors.value = response._data.errors
      },
    })
  }
  catch (err) {
    console.error(err)
    showToast('An error occurred while updating the class data.', 'error')

    return null
  }
}
