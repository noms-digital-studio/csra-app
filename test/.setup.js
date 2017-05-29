require('dotenv').config();
require('babel-register')();

const jsdom = require('jsdom');
const chai = require('chai');
const sinon = require('sinon');

const { JSDOM } = jsdom;
const { document } = new JSDOM(undefined, { url: 'http://example.com' }).window;
const exposedProperties = [
  'window',
  'navigator',
  'document',
  'localStorage',
  'sessionStorage',
];

// Test Assertion libraries
global.expect = chai.expect;
global.sinon = sinon;

// Storage Mock
const storageMock = () => {
  let storage = {};

  return {
    clear: () => {
      storage = {};
    },
    setItem: (key, value) => {
      storage[key] = value || '';
    },
    getItem: key => key in storage ? storage[key] : null,
    removeItem: (key) => {
      delete storage[key];
    },
    get length() {
      return Object.keys(storage).length;
    },
    key: (i) => {
      const keys = Object.keys(storage);
      return keys[i] || null;
    },
  };
}

// JSDOM
global.document = document;
global.window = document.defaultView;
global.window.localStorage = global.window.sessionStorage = storageMock();

global.window.scrollTo = () => {};

Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js',
};

documentRef = document;
