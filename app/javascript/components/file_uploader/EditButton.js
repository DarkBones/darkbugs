import React from 'react'

export default function EditButton(props) {
  function triggerUploadInput () {
    document.getElementById(`${props.id}FileInput`).click()
  }

  return <div
    className="dropdown mt-n5 ml-2"
    id={`${props.id}EditDropdown`}>
    <button
      className="btn btn-dark dropdown-toggle py-1 px-2"
      type="button"
      id={`${props.id}EditDropdownButton`}
      data-toggle="dropdown"
      aria-haspopup="true"
      aria-expanded="false">
      Edit
    </button>
    <div
      className="dropdown-menu"
      aria-labelledby={`${props.id}EditDropdownButton`}>
      <a
        className="dropdown-item clickable"
        onClick={triggerUploadInput}>
        Upload Image
      </a>
      <a className="dropdown-item">Remove</a>
    </div>
  </div>
}
