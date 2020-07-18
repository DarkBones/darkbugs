import React from 'react'
import axios from 'axios'

export default async function removeFile() {
  const token = document.querySelector('[name=csrf-token]').content

  axios.defaults.headers.common['X-CSRF-TOKEN'] = token

  return axios.delete(`/uploads/user_avatar`)
}
