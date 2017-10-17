import deepEqual from 'deep-equal';
import not from 'ramda/src/not';

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

export const capitalize = (str = '') =>
  str.replace(/^./, match => match.toUpperCase());

export const extractDateFromString = (dateString) => {
  const dateArray = dateString.split('-');
  const year = dateArray[2];
  const month = dateArray[1] - 1;
  const date = dateArray[0];

  return parseDate(new Date(year, month, date));
};

export const extractDateFromUTCString = (dateString) => {
  if (dateString) {
    const dateArray = dateString.split('-');
    const year = dateArray[0];
    const month = monthNames[dateArray[1] - 1];
    const date = dateArray[2].substring(0, 2);

    return `${date} ${month} ${year}`;
  }
  return '';
};


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


export const getUsernameFromDocument = () => {
  if (not(document) && not(document.body)) return '';

  const usernameElement = document.querySelector('[data-header-username]');

  if (not(usernameElement)) return '';

  return usernameElement.getAttribute('data-header-username');
};
