import React from 'react'
import PropTypes from 'prop-types'
import Field from './field/Field'
import i18n from '../../../i18n'

export default class Form extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      fieldOrder: props.fieldOrder,
      fields: props.fields
    }
  }

  handleChange = e => {
    this.setState({
      ...this.state,
      fields: {
        ...this.state.fields,
        [e.target.name]: {
          ...this.state.fields[e.target.name],
          value: e.target.value
        }
      }
    })
  }

  handleSubmit = () => {
    const values = {}
    this.props.fieldOrder.forEach(field => {
      values[field] = this.state.fields[field].value
    })

    this.props.handleSubmit(values)
  }

  render () {
    const {
      fields
    } = this.state

    const {
      fieldOrder,
      handleCancel
    } = this.props

    return (
      <form>
        {fieldOrder.map((fieldId, index) =>
          <Field
            key={fieldId}
            index={index}
            name={fields[fieldId].name}
            onChange={this.handleChange}
            params={fields[fieldId].params}
            type={fields[fieldId].type}
            value={fields[fieldId].value}
          />
        )}
        <div
          className="text-right"
        >
          <button
            className="btn btn-secondary mr-3"
            onClick={handleCancel}
            type="button"
          >
            {i18n.t('components.shared.form.cancel')}
          </button>
          <button
            className="btn btn-primary"
            onClick={this.handleSubmit}
            type="button"
          >
            {i18n.t('components.shared.form.submit')}
          </button>
        </div>
      </form>
    )
  }
}

Form.propTypes = {
  fieldOrder:   PropTypes.array.isRequired,
  fields:       PropTypes.object.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
}