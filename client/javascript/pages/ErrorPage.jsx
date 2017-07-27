import React from 'react';
import DocumentTitle from 'react-document-title';

const ErrorPage = () => (
  <DocumentTitle title="Something when wrong">
    <div>
      <h1 className="heading-xlarge u-text-align-center">Something went wrong.</h1>
      <h2 className="heading-large u-text-align-center">Please try again later.</h2>
    </div>
  </DocumentTitle>
);

export default ErrorPage;
