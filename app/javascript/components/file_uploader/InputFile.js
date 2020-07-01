import React from 'react'
import PropTypes from 'prop-types'
import uploadFile from './uploadFile'
import removeFile from './removeFile'
import Preview from './Preview'
import EditButton from './EditButton'

export default class InputFile extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      file: {},
      preview: this.props.src,
      showSubmit: false
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onRemove = this.onRemove.bind(this)
  }

  onChange = (e) => {
    e.persist()
    this.setState({
      file: e.target.files[0],
      preview: URL.createObjectURL(e.target.files[0]),
      showSubmit: true
    })
  }

  async onSubmit(e) {
    e.preventDefault()
    const resp = await uploadFile(this.state.file)
    this.setState({
      showSubmit: false
    })
  }

  async onRemove(e) {
    e.preventDefault()
    const resp = await removeFile()
    document.getElementById(`${this.props.id}FileInput`).value = null

    this.setState({
      file: {},
      showSubmit: false,
      preview: this.props.placeholder
    })
  }

  render() {
    const showSubmit = this.state.showSubmit
    let button
    if (showSubmit) {
      button = <input
        type='submit'
        className='btn btn-primary mt-4'
        id={`${this.props.id}Submit`}
      />
    }

    return (
      <div className='form'>
        <Preview file={this.state.preview} />
        <EditButton
          id={this.props.id}
          onRemove={this.onRemove}
        />
        <form onSubmit={this.onSubmit}>
          <input
            className='hidden'
            type='file'
            name='file'
            onChange={this.onChange}
            accept={this.props.fileType}
            id={`${this.props.id}FileInput`}
          />
          {button}
        </form>
      </div>
    )
  }
}

InputFile.propTypes = {
  fileType: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  src: PropTypes.string,
  placeholder: PropTypes.string
}
