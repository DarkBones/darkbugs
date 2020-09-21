import React from 'react'
import ToolbarButton from './ToolbarButton'
import { fadeIn } from 'react-animations'
import PropTypes from 'prop-types'
import Radium, {StyleRoot} from 'radium'

export default class ToolBar extends React.Component {
  constructor(props) {
    super(props)

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
    setTimeout(function() {
      this.setState({render: true})
    }.bind(this), 300)
  }

  render () {
    const toolbar = this.state.render
      ? (
        <StyleRoot>
          <div
            id="card-modal-toolbar"
            style={this.styles.fade}
          >
            <ul className="list-unstyled">
              <li>
                <ToolbarButton
                  faIconClass="fa fa-sticky-note"
                  onClick={this.props.newNote}
                />
              </li>
            </ul>
          </div>
        </StyleRoot>
      )
      : ''

    return toolbar
  }
}

ToolBar.propTypes = {
  newNote: PropTypes.func.isRequired
}