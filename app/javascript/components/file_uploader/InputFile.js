import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

export default class InputFile extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      file: {},
      placeholder: this.props.src,
      showSubmit: false
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.triggerUploadInput = this.triggerUploadInput.bind(this)
  }

  onChange = (e) => {
    e.persist()
    this.setState({
      file: e.target.files[0],
      placeholder: URL.createObjectURL(e.target.files[0]),
      showSubmit: true
    })
  }

  onSubmit = (e) => {
    e.preventDefault()
    const token = document.querySelector('[name=csrf-token]').content
    const formData = new FormData();

    formData.append("file", this.state.file)

    axios.defaults.headers.common['X-CSRF-TOKEN'] = token

    axios.post(`http://localhost:4000/uploads`, formData)
      .then(resp => console.log(resp))
      .catch(error => console.log(error))
  }

  triggerUploadInput = () => {
    document.getElementById(`${this.props.id}FileInput`).click()
  }

  render() {
    const showSubmit = this.state.showSubmit
    let button
    if (showSubmit) {
      button = <input type="submit" className="btn btn-primary" id={`${this.props.id}Submit`}/>
    }

    return (
      <div className="form">
        <div
        className="media">
          <img
            src={this.state.placeholder}
            className="img-fluid"
            />
        </div>
          <div
            className="dropdown mt-n5 ml-2"
            id={`${this.props.id}EditDropdown`}>
            <button
              className="btn btn-dark dropdown-toggle py-1 px-2"
              type="button"
              id={`${this.props.id}EditDropdownButton`}
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false">
              Edit
            </button>
            <div
              className="dropdown-menu"
              aria-labelledby={`${this.props.id}EditDropdownButton`}>
              <a
                className="dropdown-item clickable"
                onClick={this.triggerUploadInput}>
                Upload Image
              </a>
              <a className="dropdown-item">Remove</a>
            </div>
          </div>
        <form onSubmit={this.onSubmit}>
          <input className="hidden" type="file" name="file" onChange={this.onChange} accept={this.props.fileType} id={`${this.props.id}FileInput`}/>
          {button}
        </form>
      </div>
    )
  }
}

InputFile.propTypes = {
  fileType: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  src: PropTypes.string
}
