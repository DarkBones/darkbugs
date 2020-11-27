import PropTypes  from 'prop-types';
import React      from 'react';

export default class Columns extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        { this.props.columnOrder }
      </div>
    )
  }
}

Columns.propTypes = {
  columnOrder:  PropTypes.array.isRequired,
  columns:      PropTypes.object.isRequired
}