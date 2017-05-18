require('dotenv').config();
require('babel-register')();

const jsdom = require('jsdom');
const chai = require('chai');
const sinon = require('sinon');
const storage = require('mock-local-storage');

const { JSDOM } = jsdom;
const { document } = (new JSDOM(undefined, {url: 'http://example.com'})).window;
const exposedProperties = ['window', 'navigator', 'document', 'localStorage', 'sessionStorage'];


// Test Assertion libraries
global.expect = chai.expect;
global.sinon = sinon;

// JSDOM
global.document = document;
global.window = document.defaultView;
global.window.localStorage = global.window.sessionStorage = storage;


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
