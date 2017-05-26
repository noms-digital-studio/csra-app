import deepEqual from 'deep-equal';

export const allFormFieldsComplete = (formData = {}, expectedKeys = []) => {
  if (Object.keys(formData).length === 0) return false;

  return expectedKeys.every(key => !!formData[key]);
};

export const todaysDate = () => {
  // Array of day names
  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  // Array of month Names
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

  const now = new Date();

  return `${dayNames[now.getDay()]} ${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}`;
};

// Didn't want to use the shiny ES6 sets
export const addUniqElementToList = (item, list) => {
  if (list.find(elm => deepEqual(elm, item))) {
    return list;
  }

  return list.concat([item]);
};
