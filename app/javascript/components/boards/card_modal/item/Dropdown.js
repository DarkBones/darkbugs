import React      from 'react'
import Ellipsis   from '../../../shared/ellipsis/Ellipsis'
import i18n       from '../../../../i18n'
import PropTypes  from 'prop-types'

export default function Dropdown(props) {
  if (!props.userIsAuthor) return <React.Fragment />

  const links = [
    [i18n.t('components.projects.cards.CardModal.items.menu.edit'), props.editItem],
    [i18n.t('components.projects.cards.CardModal.items.menu.delete'), props.deleteItem]
  ]

  return (
    <Ellipsis
      links={links}
    />
  )
}

Dropdown.propTypes = {
  editItem:     PropTypes.func.isRequired,
  deleteItem:   PropTypes.func.isRequired,
  userIsAuthor: PropTypes.bool.isRequired
}