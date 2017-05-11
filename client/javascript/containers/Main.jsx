import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Routes from '../constants/routes';

const MainTemplate = ({ children }) => (
  <div className="o-csra-container js-enabled">
    <Header location="Liverpool" />
    <main id="content" role="main">
      <div className="phase-banner">
        <p>
          <strong className="phase-tag phase-alpha">Private Alpha</strong>
          <span>
            This is a new service – your <Link to={Routes.FEEDBACK} className="link">feedback</Link> will help us to improve it.
          </span>
        </p>
      </div>
      {children}
    </main>
    <Footer />
  </div>
);

MainTemplate.propTypes = {
  children: PropTypes.element,
};

export default MainTemplate;
