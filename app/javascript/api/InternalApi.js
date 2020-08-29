import {get, put, post, del} from './BaseApi'

const BASE_URL = '/internal'

const COLUMN_PATH = `${BASE_URL}/columns`

export class ColumnApi {
  static updateColumn(uuid, params) {
    const path = `${COLUMN_PATH}/${uuid}`

    return put(path, params)
  }
}
