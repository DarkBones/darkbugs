import MainContext        from '../MainContext';
import PropTypes          from 'prop-types';
import React              from 'react';
import StringTransformer  from '../../shared/StringTransformer';
import ToggleInput        from '../../shared/ToggleInput';
import { BoardApi }       from '../../../api/InternalApi';

export default function Board({ addBoard, deleteBoard, name, path, slug, cardUuid }) {
  const handleSubmit = async (data, projectKey, boardSlug) => {
    if (data.length === 0 || data === name) {
      if (slug.length === 0) {
        deleteBoard(slug);
        return;
      }
    }

    const params = {
      board_slug: boardSlug,
      component_type: 'Card',
      component_uuid: cardUuid,
      board: {
        name: data
      }
    };

    let response = await BoardApi.createBoard(projectKey, params);
    if (!response) return;
    if (response.status !== 200) return;

    addBoard(response.data.name, response.data.slug, response.data.path);
  }

  return (
    <MainContext.Consumer>
      {context =>
        <ToggleInput
          allowBlank=     {true}
          allowSame=      {true}
          cancelOnClick=  {false}
          handleOnCancel= {() => { deleteBoard(slug); }}
          handleOnSubmit= {(data) => { handleSubmit(data, context.projectKey, context.boardSlug) }}
          isEditing=      {slug === ''}
          toggleOnClick=  {false}
          value=          {name}
        >
          <li
            className="clickable mt-2 px-3"
            onClick=  {() => { context.switchBoard(path, slug) }}
          >
            {StringTransformer.shortenWidth(name, 6800)}
          </li>
        </ToggleInput>
      }
    </MainContext.Consumer>
  );
}

Board.propTypes = {
  addBoard:     PropTypes.func.isRequired,
  deleteBoard:  PropTypes.func.isRequired,
  cardUuid:     PropTypes.string.isRequired,
  name:         PropTypes.string.isRequired,
  path:         PropTypes.string.isRequired,
  slug:         PropTypes.string.isRequired
};