import type { iInstructors } from '@/data/models/instructors'

export const submitEvaluation = async (
  evaluationData: FormData,
  errors: Ref<Record<string, string | undefined>>,
) => {
  errors.value = {
    first_name: undefined,
    last_name: undefined,
    phone: undefined,
    email: undefined,
    reg_no: undefined,
    department_id: undefined,
    academic_year_id: undefined,
    status: undefined,
    fails: undefined,
  } // reset

  try {
    return await $api('/administrator/evaluation/create', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: evaluationData,
      onResponseError({ response }) {
        if (response._data?.errors)
          errors.value = response._data.errors
        showToast(response._data?.message || 'An error occurred while submitting the evaluation data.', 'error')
      },
    })
  }
  catch (e) {
    console.error(e)

    return null
  }
}

export const updateEvaluation = async (evaluationId: string, evaluationData: FormData, errors: Ref<Record<string, string | undefined>>) => {
  try {
    return await $api(`/administrator/evaluation/update/${evaluationId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: evaluationData,
      onResponseError({ response }) {
        errors.value = response._data.errors
      },
    })
  }
  catch (err) {
    console.error(err)
    showToast('An error occurred while updating the evaluation data.', 'error')

    return null
  }
}

export const submitInstructor = async (
  instructorData: iInstructors,
  errors: Ref<Record<string, string | undefined>>,
) => {
  errors.value = {
    first_name: undefined,
    last_name: undefined,
    phone: undefined,
    email: undefined,
    reg_no: undefined,
    department_id: undefined,
    academic_year_id: undefined,
    status: undefined,
    fails: undefined,
  } // reset

  try {
    return await $api('/administrator/instructor/create', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: instructorData,
      onResponseError({ response }) {
        if (response._data?.errors)
          errors.value = response._data.errors
        showToast(response._data?.message || 'An error occurred while submitting the instructor data.', 'error')
      },
    })
  }
  catch (e) {
    console.error(e)

    return null
  }
}

export const updateInstructor = async (instructorId: string, instructorData: iInstructors, errors: Ref<Record<string, string | undefined>>) => {
  try {
    return await $api(`/administrator/instructor/update/${instructorId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: instructorData,
      onResponseError({ response }) {
        errors.value = response._data.errors
      },
    })
  }
  catch (err) {
    console.error(err)
    showToast('An error occurred while updating the instructor data.', 'error')

    return null
  }
}
