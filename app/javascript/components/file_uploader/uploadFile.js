import React              from 'react'
import { UserAvatarApi }  from '../../api/InternalApi'

export default async function uploadFile(file) {
  const formData = new FormData();

  formData.append('file', file);

  await UserAvatarApi.uploadAvatar(formData);
}
