import React from 'react'
import i18n from '../../i18n';

export default function EditButton(props) {
  function triggerUploadInput () {
    document.getElementById(`${props.id}FileInput`).click()
  }

  return <div
    className='dropdown mt-n5 ml-2'
    id={`${props.id}EditDropdown`}>
    <button
      className='btn btn-dark dropdown-toggle py-1 px-2 small'
      type='button'
      id={`${props.id}EditDropdownButton`}
      data-toggle='dropdown'
      aria-haspopup='true'
      aria-expanded='false'
    >
      <small>
        {i18n.t('components.file_uploader.FileUploader.EditButton.button')}
      </small>
    </button>
    <div
      className='dropdown-menu'
      aria-labelledby={`${props.id}EditDropdownButton`}
    >
      <a
        className='dropdown-item clickable'
        onClick={triggerUploadInput}
      >
        {i18n.t('components.file_uploader.FileUploader.EditButton.options.upload')}
      </a>
      <a
        className='dropdown-item clickable'
        onClick={props.onRemove}
      >
        {i18n.t('components.file_uploader.FileUploader.EditButton.options.delete')}
      </a>
    </div>
  </div>
}
