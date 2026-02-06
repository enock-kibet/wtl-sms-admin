import type { iSchools } from '@/data/models/schools'

export const submitSchool = async (
  schoolData: iSchools,
  errors: Ref<Record<string, string | undefined>>,
) => {
  errors.value = {
    name: undefined,
    dean: undefined,
    description: undefined,
    status: undefined,
  } // reset

  try {
    return await $api('/faculty/create', {
      method: 'POST',
      body: schoolData,
      onResponseError({ response }) {
        if (response._data?.errors)
          errors.value = response._data.errors
      },
    })
  }
  catch (e) {
    console.error(e)
    showToast('An error occurred while submitting the school data.', 'error')

    return null
  }
}

export const updateSchool = async (schoolId: string, schoolData: iSchools, errors: Ref<Record<string, string | undefined>>) => {
  try {
    return await $api(`/faculty/update/${schoolId}`, {
      method: 'PUT',
      body: { ...schoolData },
      onResponseError({ response }) {
        errors.value = response._data.errors
      },
    })
  }
  catch (err) {
    console.error(err)
    showToast('An error occurred while updating the school data.', 'error')

    return null
  }
}

export const deleteSchool = async (ids: string[]) => {
  try {
    return await $api('/faculty/delete', {
      method: 'POST',
      body: { uuid: [...ids] },
      onResponseError({ response }) {
      },
    })
  }
  catch (err) {
    console.error(err)
    showToast('An error occurred while deleting the school data.', 'error')

    return null
  }
}

export const duplicateSchool = async (id: string) => {
  try {
    return await $api('/faculty/duplicate', {
      method: 'POST',
      body: { uuid: id },
      onResponseError({ response }) {
      },
    })
  }
  catch (err) {
    console.error(err)
    showToast('An error occurred while duplicating the school data.', 'error')

    return null
  }
}
