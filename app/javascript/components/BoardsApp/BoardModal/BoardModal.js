import Modal      from '../../shared/Modal'
import PropTypes  from 'prop-types';
import React      from 'react';

export default function BoardModal({ boardSlug, component, handleClose, show}) {
  return (
    <React.Fragment>
      Test
    </React.Fragment>
  );
}

BoardModal.propTypes = {
  boardSlug:    PropTypes.string.isRequired,
  component:    PropTypes.object.isRequired,
  handleClose:  PropTypes.func.isRequired,
  show:         PropTypes.bool.isRequired
}