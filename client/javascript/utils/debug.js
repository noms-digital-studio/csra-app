import debugModule from 'debug';

// Forcibly disable debug colours on phantomjs
if (navigator.appVersion.match(/phantomjs/i)) {
  debugModule.useColors = () => false;
}
