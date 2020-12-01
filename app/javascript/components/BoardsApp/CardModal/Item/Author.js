import Avatar       from '../../../shared/Avatar';
import PropTypes    from 'prop-types';
import React        from 'react';
import RelativeTime from '../../../shared/RelativeTime';

export default function Author({ item, isEditing, previousItem }) {
  const determineShow = () => {
    if (isEditing) return false;
    if (!previousItem) return true;
    if (previousItem.author_id !== item.author_id) return true;

    const previousTime = Date.parse(previousItem.created_at);
    const currentTime = Date.parse(item.created_at);
    const timeDifference = ((currentTime - previousTime) / 1000) / 60;

    return timeDifference >= 10;
  }

  const {
    author_avatar: authorAvatar,
    author_name: authorName,
    created_at: createdAt
  } = item;

  return (
    <React.Fragment>
      {determineShow() &&
        <table className="mb-n3">
          <tbody>
            <tr>
              <td>
                <Avatar
                  name= {authorName}
                  size= {"md"}
                  url=  {authorAvatar}
                />
              </td>
              <td className="pl-2">
                <h5 style={{display: 'inline-block'}}>
                  {authorName}
                </h5>
                <span className="ml-2 small">
                  <RelativeTime date={createdAt} />
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      }
    </React.Fragment>
  );
}

Author.propTypes = {
  item:         PropTypes.object.isRequired,
  isEditing:    PropTypes.bool.isRequired,
  previousItem: PropTypes.object
};