import PropTypes  from 'prop-types';
import React      from 'react';

// export default function Letter({letter}) {
//   return (
//     <React.Fragment>
//       <div style={{width: '100%'}} />
//       <div
//         style={{fontSize: '10em', border: '1px solid blue', display: 'inline-block'}}
//         ref={this.letter}
//       >
//         {letter}
//       </div>
//     </React.Fragment>
//   )
// }

export default class Letter extends React.Component {
  constructor(props) {
    super(props);

    this.letterRef = React.createRef()

    this.state = {
      style: {
        display: 'inline-block'
      },
      width: 0
    }
  }

  componentDidMount() {
    this.setState({
      width: this.letterRef.current.offsetWidth,
      style: {
        display: 'none'
      }
    });

    this.props.addWidth(this.props.letter, this.letterRef.current.offsetWidth);
  }

  render() {
    return (
      <div style={this.state.style}>
        <div style={{width: '100%'}} />
        <div
          style={{fontSize: '10em', display: 'inline-bock'}}
          ref={this.letterRef}
        >
          {this.props.letter}
        </div>
        <div style={{display: 'inline-block'}}>
          {this.state.width}
        </div>
      </div>
    );
  }
}

Letter.propTypes = {
  addWidth: PropTypes.func.isRequired,
  letter:   PropTypes.string.isRequired
}