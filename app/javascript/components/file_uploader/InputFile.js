import React from 'react'
import PropTypes from 'prop-types'
import uploadFile from './uploadFile'
import Preview from './Preview'
import EditButton from './EditButton'
import { useTranslation } from 'react-i18next';
import {i18n as i18next} from "i18next";

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
  }

  onChange = (e) => {
    e.persist()
    this.setState({
      file: e.target.files[0],
      placeholder: URL.createObjectURL(e.target.files[0]),
      showSubmit: true
    })
  }

  async onSubmit(e) {
    e.preventDefault()
    const resp = await uploadFile(this.state.file)
    window.location.reload(false)
  }

  // const {t, i18n} = useTranslation();
  // const t = useTranslation();
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
        {i18next.t('javascript.components.test')}
        <Preview file={this.state.placeholder} />
        <EditButton id={this.props.id} />
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
  src: PropTypes.string
}
