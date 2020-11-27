import PropTypes  from 'prop-types';
import React      from 'react';

export default function Title({children}) {
  return (
    <div className="column-title">
      <div className="row">
        <div className="col-10">
          <h1>
            {children}
          </h1>
        </div>
      </div>
    </div>
  )
}