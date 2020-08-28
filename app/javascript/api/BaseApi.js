import axios from 'axios'

export const BASE_URL = '/api/internal/v1'

export function get(path, params = {}) {
  const endpoint = `${BASE_URL}${path}`

  return axios
    .get(endpoint, {params})
    .then(response => {
      return response.data
    })
}

export function post(path, params) {
  const endpoint = `${BASE_URL}${path}`

  return axios.post(endpoint, params)
}

export function put(path, params) {
  const endpoint = `${BASE_URL}${path}`

  return axios.put(endpoint, params)
}

export function del(path) {
  const endpoint = `${BASE_URL}${path}`

  return axios.delete(endpoint)
}
