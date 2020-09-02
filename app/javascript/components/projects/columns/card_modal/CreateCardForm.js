import React from 'react'
import i18n from "../../../../i18n";

export default class CreateCardForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: ''
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.inputRef.focus()
    }, 1)
  }

  handleKeyDown = () => {
    if (event.key === 'Enter') {
      this.props.handleSubmit()
    }
  }

  render() {
    return(
      <React.Fragment>
        <label>
          {i18n.t('components.projects.cards.CardModal.form.name.label')}
          <abbr title={i18n.t('components.shared.form.required.title')}> *</abbr>
        </label>
        <input
          className='form-control'
          placeholder={i18n.t('components.projects.cards.CardModal.form.name.placeholder')}
          ref={(input) => {
            this.inputRef = input
          }}
          name='name'
          value={this.props.form.name}
          onChange={this.props.handleChange}
          onKeyDown={this.handleKeyDown}
        />
      </React.Fragment>
    )
  }
}
