import React from 'react'
import axios from "axios";

export default function UploadFile(file) {
  const token = document.querySelector('[name=csrf-token]').content
  const formData = new FormData();

  formData.append("file", file)

  axios.defaults.headers.common['X-CSRF-TOKEN'] = token

  axios.post(`http://localhost:4000/uploads`, formData)
    .then(resp => {
      console.log(resp)
      return resp
    })
    .catch(err => {
      console.log(err)
      return err
    })
}
