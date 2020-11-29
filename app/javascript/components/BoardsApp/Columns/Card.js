import MainContext  from '../MainContext';
import PropTypes    from 'prop-types';
import React        from 'react';

export default function Card({uuid}) {
  return (
    <MainContext.Consumer>
      {context =>
        <div>
          {`CARD: ${context.cards[uuid].name}`}
        </div>
      }
    </MainContext.Consumer>
  );
}

Card.propTypes = {
  uuid: PropTypes.string.isRequired
}