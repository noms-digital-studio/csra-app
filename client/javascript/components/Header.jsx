import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import { signOut } from '../actions';
import routes from '../constants/routes';

const Header = ({ username, signedIn, onSignOut }) => {
  const url = signedIn ? routes.DASHBOARD : '/';

  return (
    <div>
      <header role="banner" id="global-header" className="c-global-header with-proposition">
        <div className="header-wrapper">
          <div className="header-global c-header-global">
            <div className="header-logo">
              <Link to={url} title="Go to the HMPS homepage" id="logo" className="content">
                <img
                  src="/assets/images/gov.uk_logotype_crown_invert_trans.png"
                  width="36"
                  height="32"
                  alt="GOV.UK"
                />
                <span>HMPPS</span>
              </Link>
            </div>
          </div>

          <div className="header-proposition c-header-proposition">
            <div className="content">
              <nav id="proposition-menu">
                {signedIn &&
                  <div className="c-global-header__wrapper">
                    <span className="c-global-header__username" data-header-username>
                      {username}
                    </span>
                    <span className="c-profile-holder c-profile-holder--global-header" />
                    <button type="button" data-sign-out onClick={onSignOut} className="c-profile-logout link">
                      Sign out
                    </button>
                  </div>}
                <Link to="/" id="proposition-name">Cell sharing risk assessment</Link>
              </nav>
            </div>
          </div>
        </div>
      </header>
      <div id="global-header-bar" />
    </div>
  );
};
Header.propTypes = {
  signedIn: PropTypes.bool,
  username: PropTypes.string,
  onSignOut: PropTypes.func,
};

Header.defaultProps = {
  onSignOut: () => {},
};

const mapStateToProps = state => ({
  username: state.login.currentUser.name,
  signedIn: state.login.signedIn,
});

const mapActionsToProps = dispatch => ({
  onSignOut: () => {
    dispatch(signOut());
    dispatch(replace(routes.SIGN_IN));
  },
});

export { Header };
export default connect(mapStateToProps, mapActionsToProps)(Header);
