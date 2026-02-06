import type { iDepartments } from '@/data/models/departments'

export const submitDepartment = async (
  departmentData: iDepartments,
  errors: Ref<Record<string, string | undefined>>,
) => {
  errors.value = {
    name: undefined,
    dean: undefined,
    description: undefined,
    status: undefined,
  } // reset

  try {
    return await $api('/department/create', {
      method: 'POST',
      body: departmentData,
      onResponseError({ response }) {
        if (response._data?.errors)
          errors.value = response._data.errors
      },
    })
  }
  catch (e) {
    console.error(e)
    showToast('An error occurred while submitting the department data.', 'error')

    return null
  }
}

export const updateDepartment = async (departmentId: string, departmentData: iDepartments, errors: Ref<Record<string, string | undefined>>) => {
  try {
    return await $api(`/department/update/${departmentId}`, {
      method: 'PUT',
      body: { ...departmentData },
      onResponseError({ response }) {
        errors.value = response._data.errors
      },
    })
  }
  catch (err) {
    console.error(err)
    showToast('An error occurred while updating the department data.', 'error')

    return null
  }
}

export const deleteDepartment = async (ids: string[]) => {
  try {
    return await $api('/department/delete', {
      method: 'POST',
      body: { uuid: [...ids] },
      onResponseError({ response }) {
      },
    })
  }
  catch (err) {
    console.error(err)
    showToast('An error occurred while deleting the department data.', 'error')

    return null
  }
}

export const duplicateDepartment = async (id: string) => {
  try {
    return await $api('/department/duplicate', {
      method: 'POST',
      body: { uuid: id },
      onResponseError({ response }) {
      },
    })
  }
  catch (err) {
    console.error(err)
    showToast('An error occurred while duplicating the department data.', 'error')

    return null
  }
}
