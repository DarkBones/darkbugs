import React              from 'react'
import { UserAvatarApi }  from '../../api/InternalApi'

export default async function removeFile() {
  await UserAvatarApi.deleteAvatar();
}
