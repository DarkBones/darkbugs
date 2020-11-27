import Body         from './Body';
import i18n         from '../../../i18n';
import Modal        from '../../shared/Modal';
import PropTypes    from 'prop-types';
import React        from 'react';
import { BoardApi } from '../../../api/InternalApi';

export default function BoardModal({ addBoard, boardSlug, component, handleClose, show }) {
  const handleSubmit = async (data) => {
    const { type, uuid } = component;

    const params = {
      board_slug: boardSlug,
      component_type: type,
      component_uuid: uuid,
      board: data
    };

    let response = await BoardApi.createBoard(params);

    if (!response) return;
    if (response.status !== 200) return;

    const { name, path, slug } = response.data;

    addBoard(name, path, slug);
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
  addBoard:     PropTypes.func.isRequired,
  boardSlug:    PropTypes.string.isRequired,
  component:    PropTypes.object.isRequired,
  handleClose:  PropTypes.func.isRequired,
  show:         PropTypes.bool.isRequired
}