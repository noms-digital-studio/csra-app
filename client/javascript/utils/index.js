import deepEqual from 'deep-equal';

export const allFormFieldsComplete = (formData = {}, expectedKeys = []) => {
  if (Object.keys(formData).length === 0) return false;

  return expectedKeys.every(key => !!formData[key]);
};

export const todaysDate = (date) => {
  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

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

  return `${dayNames[date.getDay()]} ${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};

export const addUniqElementToList = (item, list) => {
  if (list.find(elm => deepEqual(elm, item))) {
    return list;
  }

  return list.concat([item]);
};

export const capitalize = (str = '') =>
  str.replace(/^./, match => match.toUpperCase());
