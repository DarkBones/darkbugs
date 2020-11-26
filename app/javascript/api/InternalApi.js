import {get, put, post, del} from './BaseApi'

const BASE_URL = '/internal'

const AVATAR_PATH     = `${BASE_URL}/user_avatars`
const BOARD_PATH      = `${BASE_URL}/boards`
const CARD_ITEM_PATH  = `${BASE_URL}/card_items`
const CARD_PATH       = `${BASE_URL}/cards`
const COLUMN_PATH     = `${BASE_URL}/columns`

export class UserAvatarApi {
  static uploadAvatar(params) {
    return post(AVATAR_PATH, params)
  }

  static deleteAvatar() {
    return del(AVATAR_PATH)
  }
}

export class BoardApi {
  static reorderColumns(slug, params) {
    const path = `${BOARD_PATH}/${slug}/reorder_columns`

    return put(path, params)
  }

  static reorderCards(slug, params) {
    const path = `${BOARD_PATH}/${slug}/reorder_cards`

    return put(path, params)
  }

  static updateName(slug, params) {
    const path = `${BOARD_PATH}/${slug}`

    return put(path, params)
  }

  static createBoard(params) {
    const path = BOARD_PATH

    return post(path, params)
  }
}

export class CardApi {
  static createCard(params) {
    const path = CARD_PATH

    return post(path, params)
  }

  static deleteCard(cardUuid) {
    const path = `${CARD_PATH}/${cardUuid}`

    return del(path)
  }

  static getDetails(cardUuid) {
    const path = `${CARD_PATH}/${cardUuid}`

    return get(path)
  }

  static updateCard(cardUuid, params) {
    const path = `${CARD_PATH}/${cardUuid}`

    return put(path, params)
  }
}

export class CardItemApi {
  static createItem(params) {
    const path = CARD_ITEM_PATH

    return post(path, params)
  }

  static deleteItem(uuid) {
    const path = `${CARD_ITEM_PATH}/${uuid}`

    return del(path, uuid)
  }

  static updateItem(uuid, params) {
    const path = `${CARD_ITEM_PATH}/${uuid}`

    return put(path, params)
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
