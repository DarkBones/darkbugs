import Body       from './Body';
import i18n       from '../../../i18n';
import Modal      from '../../shared/Modal';
import PropTypes  from 'prop-types';
import React      from 'react';

export default function BoardModal({ boardSlug, component, handleClose, show }) {
  const handleSubmit = data => {
    console.log('handleSubmit', data);
  }

  return (
    <Modal
      handleOnClose={handleClose}
      show={show}
      title={i18n.t('components.BoardsApp.BoardModal.title')}
    >
      <Body
        handleClose={handleClose}
        handleSubmit={handleSubmit}
      />
    </Modal>
  );
}

BoardModal.propTypes = {
  boardSlug:    PropTypes.string.isRequired,
  component:    PropTypes.object.isRequired,
  handleClose:  PropTypes.func.isRequired,
  show:         PropTypes.bool.isRequired
}