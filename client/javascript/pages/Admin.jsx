import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import { storeData, readSingleFile, clearBrowserStorage } from '../services';
import { getOffenderNomisProfiles, getViperScores } from '../actions';

import routes from '../constants/routes';

// getViperScores: () => dispatch(getViperScores()),

class Admin extends Component {
  constructor() {
    super();
    this.state = {
      error: false,
      errorMessage: '',
      success: false,
      successMessage: '',
    };
  }

  loadFile({ target: { files, name } }) {
    readSingleFile(files[0], (error, data) => {
      if (error) return this.setState({ error: true, success: false });

      try {
        JSON.parse(data);
      } catch (err) {
        return this.setState({
          error: true,
          success: false,
          errorMessage: err.message,
        });
      }

      storeData(name, data);

      this.props.getViperScores();

      this.setState({
        error: false,
        success: true,
        successMessage: 'File successfully loaded',
      });
    });
  }

  addDefaultPrisoners() {
    this.props.getOffenderNomisProfiles();
    this.props.getViperScores();

    this.setState({
      error: false,
      success: true,
      successMessage: 'Test prisoners successfully added',
    });
  }

  clearBrowser() {
    clearBrowserStorage();
    this.setState({
      error: false,
      success: true,
      successMessage: 'Browser data cleared successfully',
    });
  }

  render() {
    return (
      <DocumentTitle title={this.props.title}>
        <div>
          <h1 className="heading-xlarge">Admin</h1>

          {this.state.error &&
            <div
              className="error-summary"
              role="group"
              aria-labelledby="error-summary-heading-example-1"
              tabIndex="-1"
            >

              <h1
                className="heading-medium error-summary-heading"
                id="error-summary-heading-example-1"
              >
                Whoops something went wrong. Please ensure that this is a valid JSON file.
                <br />
                {this.state.errorMessage}
              </h1>

            </div>}

          {this.state.success &&
            <div className="govuk-box-highlight">
              <h1 className="bold-large">Success</h1>
              <p>
                {this.state.successMessage} <br />
              </p>
            </div>}

          <h3 className="heading-medium">Load Viper scores file</h3>
          <input
            name="viperScores"
            onChange={e => this.loadFile(e)}
            type="file"
          />

          <h3 className="heading-medium">Preload Test Prisoners</h3>
          <button
            onClick={() => this.addDefaultPrisoners()}
            className="button"
            data-load-data-button
            type="button"
          >
            Load Data
          </button>

          <h3 className="heading-medium">Reset</h3>
          <button
            onClick={() => this.clearBrowser()}
            className="button"
            data-clear-button
            type="button"
          >
            Clear Browser Session and Local Storage
          </button>

          <Link
            href="/sign-in"
            className="button c-btn-right--xcustom"
            data-continue-button
          >
            Continue to sign in
          </Link>
        </div>
      </DocumentTitle>
    );
  }
}

Admin.defaultProps = {
  title: 'Secret Admin page',
};

export default connect(null, { getOffenderNomisProfiles, getViperScores })(
  Admin,
);
