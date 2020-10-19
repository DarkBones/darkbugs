import React              from 'react'
import JavascriptTimeAgo  from 'javascript-time-ago'
import en                 from 'javascript-time-ago/locale/en'
import ReactTimeAgo       from 'react-time-ago'
import PropTypes          from 'prop-types'

JavascriptTimeAgo.addLocale(en)

export default function RelativeTime(props) {
  const date = Date.parse(props.date)

  return <ReactTimeAgo date={date}/>
}

RelativeTime.propTypes = {
  date: PropTypes.string.isRequired
}