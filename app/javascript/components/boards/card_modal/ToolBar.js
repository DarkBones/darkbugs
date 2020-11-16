import React          from 'react'
import i18n           from '../../../i18n'
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

  newBoard = () => {
    this.props.newBoard('')
  }

  newNote = () => {
    const params = {
      content: ''
    }

    this.props.newItem('note', params)
  }

  deleteCard = () => {
    this.props.deleteCard()
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
                faIconClass="fa fa-columns"
                buttonText={i18n.t('components.projects.cardmodal.toolbar.new_board')}
                onClick={this.newBoard}
              />
            </li>
            <li>
              <ToolBarButton
                faIconClass="fa fa-sticky-note"
                buttonText={i18n.t('components.projects.cardmodal.toolbar.new_note')}
                onClick={this.newNote}
              />
            </li>
            <li>
              <ToolBarButton
                faIconClass="fa fa-trash"
                buttonText={i18n.t('components.projects.cardmodal.toolbar.delete_card')}
                onClick={this.deleteCard}
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
  deleteCard: PropTypes.func.isRequired,
  newBoard:   PropTypes.func.isRequired,
  newItem:    PropTypes.func.isRequired
}