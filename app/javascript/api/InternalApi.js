import {get, put, post, del} from './BaseApi'

const BASE_URL = '/internal'

const COLUMN_PATH = `${BASE_URL}/columns`

export class ColumnApi {
  static updateColumn(uuid, params) {
    const path = `${COLUMN_PATH}/${uuid}`

    return put(path, params)
  }

  static createColumn(boardSlug, params) {
    const path = COLUMN_PATH

    params = {
      board_slug: boardSlug,
      column: params
    }

    return post(path, params)
  }

  static deleteColumn(uuid) {
    const path = `${COLUMN_PATH}/${uuid}`

    return del(path)
  }
}
