import React          from 'react'
import ToolBarButton  from './ToolBarButton'
import PropTypes      from 'prop-types'
import { fadeIn }     from 'react-animations'

import Radium, { StyleRoot } from 'radium'

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

  newNote = () => {
    const params = {
      content: 'test content'
    }

    this.props.newItem('note', params)
  }

  toolBar = () => {
    if (!this.state.render) return ''

    return (
      <StyleRoot>
        <div
          id="card-modal-toolbar"
          style={this.styles.fade}
        >
          <ul
            className="list-unstyled"
          >
            <li>
              <ToolBarButton
                faIconClass="fa fa-sticky-note"
                onClick={this.newNote}
              />
            </li>
          </ul>
        </div>
      </StyleRoot>
    )
  }

  render() {
    const toolbar = this.toolBar()

    return toolbar
  }
}

ToolBar.propTypes = {
  newItem: PropTypes.func.isRequired
}