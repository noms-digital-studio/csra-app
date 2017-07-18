import deepEqual from 'deep-equal';

export const allFormFieldsComplete = (formData = {}, expectedKeys = []) => {
  if (Object.keys(formData).length === 0) return false;

  return expectedKeys.every(key => !!formData[key]);
};

export const parseDate = (date) => {
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

  return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};

export const addUniqElementToList = (item, list) => {
  if (list.find(elm => deepEqual(elm, item))) {
    return list;
  }

  return list.concat([item]);
};

export const capitalize = (str = '') =>
  str.replace(/^./, match => match.toUpperCase());
