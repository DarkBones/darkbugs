import en                 from 'javascript-time-ago/locale/en';
import JavascriptTimeAgo  from 'javascript-time-ago';
import PropTypes          from 'prop-types';
import React              from 'react';
import ReactTimeAgo       from 'react-time-ago';

JavascriptTimeAgo.addLocale(en);

export default function RelativeTime({ date }) {
  return <ReactTimeAgo date={Date.parse(date)}/>
}

RelativeTime.propTypes = {
  date: PropTypes.string.isRequired
};