require('dotenv').config();
require('babel-register')();

const { jsdom } = require('jsdom');
const chai = require('chai');
const sinon = require('sinon');
const mockLocalStorage = require('mock-local-storage');

const exposedProperties = ['window', 'navigator', 'document'];


// Test Assertion libraries
global.expect = chai.expect;
global.sinon = sinon;

// JSDOM
global.document = jsdom('<!doctype html><html><body></body></html>', { url: 'http://localhost' });
global.window = document.defaultView;
global.window.localStorage = mockLocalStorage;
global.window.sessionStorage = mockLocalStorage;

Object.keys(document.defaultView).forEach((property) => {
    if (typeof global[property] === 'undefined') {
        exposedProperties.push(property);
        global[property] = document.defaultView[property];
    }
});

global.navigator = {
    userAgent: 'node.js'
};

documentRef = document;
