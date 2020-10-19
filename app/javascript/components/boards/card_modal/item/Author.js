import React        from 'react'
import Avatar       from '../../../shared/avatar/Avatar'
import PropTypes    from 'prop-types'
import RelativeTime from '../../../shared/relative_time/RelativeTime'

export default function Author(props) {
  const authorElement = () => {
    const show = determineShow()

    if (!show) return <React.Fragment />

    const {
      author_avatar,
      author_name,
      created_at
    } = props.item

    return (
      <table
        className="mb-n3"
      >
        <tr>
          <td>
            <Avatar
              name={author_name}
              size="md"
              url={author_avatar}
            />
          </td>
          <td className="pl-2">
            <h5 style={{display: 'inline-block'}}>
              {author_name}
            </h5>
            <span className="ml-2 small">
              <RelativeTime date={created_at} />
            </span>
          </td>
        </tr>
      </table>
    )
  }

  const determineShow = () => {
    const { item, isEditing, previousItem } = props

    if (isEditing) return false

    if (!previousItem) return true

    if (previousItem.author_id !== item.author_id) return true

    const previousTime = Date.parse(previousItem.created_at)
    const currentTime = Date.parse(item.created_at)
    const timeDifference = ((currentTime - previousTime) / 1000) / 60

    return timeDifference >= 15
  }

  return authorElement()
}

Author.propTypes = {
  item:         PropTypes.object.isRequired,
  isEditing:    PropTypes.bool.isRequired,
  previousItem: PropTypes.object
}