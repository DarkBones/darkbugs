import React      from 'react';
import PropTypes  from 'prop-types';

export default function ToolbarButton(props) {
  const { handleOnClick, faIconClass, buttonText } = props;

  return (
    <React.Fragment>
      <button
        className="btn btn-default btn-circle btn-circle-xl"
        onClick={handleOnClick}
      >
        <i
          className={`${faIconClass} fa-3x`}
        />
      </button>
      <div
        className="text-light font-weight-bold ml-2 p-1 button-label"
      >
        {buttonText}
      </div>
    </React.Fragment>
  )
}

ToolbarButton.propTypes = {
  buttonText:     PropTypes.string.isRequired,
  faIconClass:    PropTypes.string.isRequired,
  handleOnClick:  PropTypes.func.isRequired
};