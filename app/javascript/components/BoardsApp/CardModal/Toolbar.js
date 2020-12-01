import PropTypes  from 'prop-types';
import React      from 'react';
import { fadeIn } from 'react-animations';

import Radium, { StyleRoot } from 'radium';

export default class Toolbar extends React.Component {
  constructor(props) {
    super(props);

    this.styles = {
      fade: {
        animation: 'x 0.5s',
        animationName: Radium.keyframes(fadeIn, 'fadeIn')
      }
    }

    this.state = {
      render: false
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({render: true});
    }, 300);
  }

  render() {
    const { children } = this.props;

    return (
      <React.Fragment>
        {this.state.render &&
          <StyleRoot>
            <div
              id="card-modal-toolbar"
              style={this.styles.fade}
            >
              <ul
                className="list-unstyled"
              >
                {children.map((child, index) =>
                  <li key={index}>
                    {child}
                  </li>
                )}
              </ul>
            </div>
          </StyleRoot>
        }
      </React.Fragment>
    );
  }
}

Toolbar.propTypes = {
  children: PropTypes.array.isRequired
};