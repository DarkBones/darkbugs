import React from 'react'
import axios from 'axios'

export default async function uploadFile(file) {
  const token = document.querySelector('[name=csrf-token]').content
  const formData = new FormData();

  formData.append('file', file)

  axios.defaults.headers.common['X-CSRF-TOKEN'] = token

  return axios.post(`/uploads/user_avatar`, formData)
}
