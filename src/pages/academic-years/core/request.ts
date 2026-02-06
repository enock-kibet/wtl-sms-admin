export const submitAcademicYear = async (
  academicYearData: FormData,
  errors: Ref<Record<string, string | undefined>>,
) => {
  errors.value = {
    name: undefined,
    description: undefined,
    icon: undefined,
    start_date: undefined,
    end_date: undefined,
    status: undefined,
  } // reset

  try {
    return await $api('/academic-year/create', {
      method: 'POST',
      body: academicYearData,
      headers: {
        Accept: 'application/json',
      },
      onResponseError({ response }) {
        if (response._data?.errors)
          errors.value = response._data.errors
      },
    })
  }
  catch (e) {
    console.error(e)
    showToast('An error occurred while submitting the academic year data.', 'error')

    return null
  }
}

export const updateAcademicYear = async (academicYearId: string, academicYearData: FormData, errors: Ref<Record<string, string | undefined>>) => {
  try {
    return await $api(`/academic-year/update/${academicYearId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: academicYearData,
      onResponseError({ response }) {
        errors.value = response._data.errors
      },
    })
  }
  catch (err) {
    console.error(err)
    showToast('An error occurred while updating the academic year data.', 'error')

    return null
  }
}

export const deleteAcademicYear = async (ids: string[]) => {
  try {
    return await $api('/academic-year/delete', {
      method: 'POST',
      body: { uuid: [...ids] },
      onResponseError({ response }) {
      },
    })
  }
  catch (err) {
    console.error(err)
    showToast('An error occurred while deleting the academic year data.', 'error')

    return null
  }
}

export const duplicateAcademicYear = async (id: string) => {
  try {
    return await $api('/academic-year/duplicate', {
      method: 'POST',
      body: { uuid: id },
      onResponseError({ response }) {
      },
    })
  }
  catch (err) {
    console.error(err)
    showToast('An error occurred while duplicating the academic year data.', 'error')

    return null
  }
}
