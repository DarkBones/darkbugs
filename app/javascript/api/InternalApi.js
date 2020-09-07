import {get, put, post, del} from './BaseApi'

const BASE_URL = '/internal'

const BOARD_PATH  = `${BASE_URL}/boards`
const CARD_PATH   = `${BASE_URL}/cards`
const COLUMN_PATH = `${BASE_URL}/columns`

export class BoardApi {
  static reorderColumns(slug, params) {
    const path = `${BOARD_PATH}/${slug}/reorder_columns`

    return put(path, params)
  }

  static reorderCards(slug, params) {
    const path = `${BOARD_PATH}/${slug}/reorder_cards`

    return put(path, params)
  }
}

export class CardApi {
  static createCard(params) {
    const path = CARD_PATH

    console.log(params)
    return post(path, params)
  }
}

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
