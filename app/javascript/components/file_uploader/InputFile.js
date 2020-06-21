import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

export default class InputFile extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      file: {}
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onChange = (e) => {
    console.log('onChange')
    e.persist()
    this.setState({
      file: e.target.files[0]
    }, function(){
      console.log(this.state.file)
    })
  }

  onSubmit = (e) => {
    e.preventDefault()
    const token = document.querySelector('[name=csrf-token]').content
    const formData = new FormData();

    formData.append("file", this.state.file)

    console.log(formData)
    console.log('fetch')

    axios.defaults.headers.common['X-CSRF-TOKEN'] = token

    axios.post(`http://localhost:4000/uploads`, formData)
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
