import PropTypes  from 'prop-types';
import React      from 'react';

export default function Note({ params, uuid }) {
  return (
    <div
      className="display-linebreak bg-light rounded p-3 my-3"
      itemType="note"
      id={uuid}
    >
      {params.content}
    </div>
  )
}

Note.propTypes = {
  params: PropTypes.object.isRequired,
  uuid:   PropTypes.string.isRequired
};