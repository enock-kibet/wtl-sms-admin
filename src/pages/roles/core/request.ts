interface iRoles {
  id?: string | number
  name: string
  guard: 'admin' | 'instructor' | 'student' | null
  permissions: string[]
}

export const submitRole = async (
  roleData: iRoles,
) => {
  try {
    return await $api('/administrator/roles/create', {
      method: 'POST',
      body: roleData,
      onResponseError({ response }) {
        // if (response._data?.errors)
        // errors.value = response._data.errors
      },
    })
  }
  catch (e) {
    console.error(e)
    showToast('An error occurred while submitting the role data.', 'error')

    return null
  }
}

export const updateRole = async (roleId: string, roleData: iRoles) => {
  try {
    return await $api(`/administrator/roles/update/${roleId}`, {
      method: 'PUT',
      body: { ...roleData },
      onResponseError({ response }) {
      },
    })
  }
  catch (err) {
    console.error(err)
    showToast('An error occurred while updating the role data.', 'error')

    return null
  }
}

export const deleteRole = async (roleId?: string) => {
  try {
    return await $api(`/administrator/roles/${roleId}`, {
      method: 'DELETE',
      onResponseError({ response }) {
      },
    })
  }
  catch (err) {
    console.error(err)
    showToast('An error occurred while deleting the role data.', 'error')

    return null
  }
}
