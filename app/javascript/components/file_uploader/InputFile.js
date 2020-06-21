import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

export default class InputFile extends React.Component {

  state = {
    file: {}
  }

  onChange = (e) => {
    e.persist()
    this.setState(() => {
      return {
        [e.target.name]: e.target.files[0]
      }
    })
  }

  onSubmit = (e) => {
    e.preventDefault()
    const form = new FormData()
    form.append("file", this.state.file)
    // fetch(`http://localhost:4000/uploads`, {
    //   method: "POST",
    //   body: form
    // })
    axios.post(`http://localhost:4000/uploads`, {params: form})
      .then(resp => console.log(resp))
      .catch(error => console.log(error))
  }

  render() {
    // alert(document.querySelector('[name=csrf-token]').content);
    return (
      <div className="form">
        <h1>New Upload</h1>
        <form onSubmit={this.onSubmit}>
          <label>Image Upload</label>
          <input type="file" name="file" onChange={this.onChange} accept={this.props.fileType}/>
          <br/>
          <input type="submit"/>
        </form>
      </div>
    )
  }
}

InputFile.propTypes = {
  fileType: PropTypes.string.isRequired
}
