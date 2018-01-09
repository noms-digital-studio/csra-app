import deepEqual from 'deep-equal';
import not from 'ramda/src/not';
import tail from 'ramda/src/tail';
import head from 'ramda/src/head';
import toUpper from 'ramda/src/toUpper';
import toLower from 'ramda/src/toLower';
import moment from 'moment';

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const allFormFieldsComplete = (formData = {}, expectedKeys = []) => {
  if (Object.keys(formData).length === 0) return false;

  return expectedKeys.every(key => !!formData[key]);
};

export const parseDate = date => (`${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`);

export const addUniqElementToList = (item, list) => {
  if (list.find(elm => deepEqual(elm, item))) {
    return list;
  }

  return list.concat([item]);
};

export const capitalize = (str = '') => {
  if (!str) return '';
  if (str.length < 2) return str;

  return `${toUpper(head(str))}${toLower(tail(str))}`;
};

export const extractDateFromString = (dateString) => {
  if (!dateString) return false;

  return moment(dateString).format('D MMM YYYY');
};

export const extractDateFromUTCString = dateString => moment(dateString).format('D MMMM YYYY');


export const getTimeStamp = (date) => {
  const utcDateTimeStamp = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds(),
  );

  return utcDateTimeStamp;
};


export const getUserDetailsFromDocument = () => {
  if (not(document) && not(document.body)) return '';

  const userDetailsElement = document.querySelector('[data-element-id="user-details"]');

  if (not(userDetailsElement)) return { username: '', name: '' };

  return {
    username: userDetailsElement.getAttribute('data-header-username'),
    name: userDetailsElement.getAttribute('data-header-name'),
  };
};
