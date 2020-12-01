import PropTypes  from 'prop-types';
import React      from 'react';

export default function Avatar({ name, size, url }) {
  if (!size) size = 'xl';
  const divClass = `avatar avatar-${size}`

  return (
    <div
      className={divClass}
      title=    {name}
    >
      <img
        className="avatar-img img-fluid dropdown-user-img"
        src=      {url}
      />
    </div>
  );
}

Avatar.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.string,
  url:  PropTypes.string.isRequired
};