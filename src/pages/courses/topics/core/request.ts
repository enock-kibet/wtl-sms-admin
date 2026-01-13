import type { iTopic } from '@/data/models/topics'

export const submitTopic = async (
  topicData: iTopic,
  errors: Ref<Record<string, string | undefined>>,
) => {
  errors.value = {
    course_id: undefined,
    semester: undefined,
    title: undefined,
    description: undefined,
    status: undefined,
  } // reset

  try {
    return await $api('/administrator/topic/create', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: topicData,
      onResponseError({ response }) {
        if (response._data?.errors)
          errors.value = response._data.errors
        showToast(response._data?.message || 'An error occurred while submitting the topic data.', 'error')
      },
    })
  }
  catch (e) {
    console.error(e)

    return null
  }
}

export const updateTopic = async (topicId: string, topicData: iTopic, errors: Ref<Record<string, string | undefined>>) => {
  try {
    return await $api(`/administrator/topic/update/${topicId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: topicData,
      onResponseError({ response }) {
        errors.value = response._data.errors
      },
    })
  }
  catch (err) {
    console.error(err)
    showToast('An error occurred while updating the topic data.', 'error')

    return null
  }
}
