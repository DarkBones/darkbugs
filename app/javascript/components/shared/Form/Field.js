import i18n       from '../../../i18n';
import PropTypes  from 'prop-types';
import React      from 'react';

export default class Field extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.firstInputRef.focus();
    });
  }

  handleOnChange = e => {
    this.setState({
      value: e.target.value
    });

    this.props.onChange(e);
  }

  inputField = type => {
    const className = 'form-control mb-2';

    const { value } = this.state;
    const { name, params } = this.props;

    let ref = {};

    if (this.props.index === 0) {
      ref = (firstInput) => {
        this.firstInputRef = firstInput;
      }
    }

    const props = {
      ...params,
      className:  className,
      name:       name,
      onChange:   this.handleOnChange,
      ref:        ref,
      value:      value
    };

    switch (type) {
      case 'text':
        return (
          <textarea {...props} />
        );
      case 'input':
        return (
          <input {...props} />
        );
    }
  }

  render() {
    const {
      name,
      type
    } = this.props;

    const input = this.inputField(type);
    const label = i18n.t(`components.shared.form.fields.labels.${name}`);

    return (
      <React.Fragment>
        <label
          className="small mb-1"
        >
          {label}
        </label>
        {input}
      </React.Fragment>
    );
  }
}

Field.propTypes = {
  index:    PropTypes.number,
  name:     PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  params:   PropTypes.object,
  type:     PropTypes.string.isRequired,
  value:    PropTypes.string.isRequired
}