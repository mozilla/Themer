import React from "react";
import Modal from "../Modal";

class ExportThemeDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      panelIndex: 0,
      themeName: ""
    };
  }

  isNextEnabled() {
    const { panelIndex, themeName } = this.state;
    if (panelIndex === 0) {
      return true;
    }
    if (panelIndex === 1 && themeName.length) {
      return true;
    }
    return false;
  }

  renderNext = onClick => (
    <button
      disabled={!this.isNextEnabled()}
      className="modal__button"
      onClick={() => this.isNextEnabled() && onClick()}
    >
      Next
    </button>
  );

  handleNext = () => {
    let panel = this.state.panelIndex;
    panel++;
    this.setState({ panelIndex: panel });
  };

  handleClose = () => {
    this.setState({ panelIndex: 0 });
    this.props.clearExportedTheme();
  };

  handleExportClick = () => {
    const { themeName: name } = this.state;
    if (!name.length) {
      return;
    }
    const { setExportThemeProgress, exportTheme } = this.props;
    this.setState({ themeName: "" });
    setExportThemeProgress(true);
    exportTheme({ name });
  };

  handleThemeNameChange = ev => {
    this.setState({ themeName: ev.target.value });
  };

  renderContent() {
    const { panelIndex, themeName } = this.state;
    const {
      isThemeExportInProgress,
      shouldOfferExportedTheme,
      exportedTheme
    } = this.props;

    // TODO: Add a progress spinner here?
    if (isThemeExportInProgress) {
      return (
        <>
          <h2>Export in progress!</h2>
          <p>Please wait while we package up your theme.</p>
        </>
      );
    }

    if (shouldOfferExportedTheme) {
      // exportedTheme has XPI MIME set in src/web/lib/export.js
      const XPI_MIME = "application/x-xpinstall";
      // To ensure that the file is downloaded loaded than installed,
      // use the ZIP MIME type in the data:-URL.
      const ZIP_MIME = "application/zip";
      return (
        <>
          <h2>Ready to download!</h2>
          <p>
            Grab the XPI if you want to{" "}
            <a
              href="https://extensionworkshop.com/documentation/publish/submitting-an-add-on/"
              target="_blank"
              rel="noopener noreferrer"
            >
              submit
            </a>{" "}
            your theme to the{" "}
            <a
              href="https://addons.mozilla.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Firefox Add-ons Marketplace
            </a>{" "}
            or grab the ZIP if you want to explore the code yourself.
          </p>
          <div className="modal__buttons">
            <a
              className="modal__button"
              download="theme.zip"
              href={exportedTheme.replace(XPI_MIME, ZIP_MIME)}
            >
              theme.zip
            </a>{" "}
            <a
              className="modal__button"
              download="theme.xpi"
              href={exportedTheme}
            >
              theme.xpi
            </a>{" "}
          </div>
        </>
      );
    }

    switch (panelIndex) {
      case 0:
        return (
          <>
            <h2>Export your theme</h2>
            <p>
              Create a compressed version of your theme that you can{" "}
              <a
                href="https://extensionworkshop.com/documentation/publish/submitting-an-add-on/"
                target="_blank"
                rel="noopener noreferrer"
              >
                submit
              </a>{" "}
              to the{" "}
              <a
                href="https://addons.mozilla.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Firefox Add-ons Marketplace
              </a>
              .
            </p>
            {this.renderNext(this.handleNext)}
          </>
        );
      case 1:
        return (
          <>
            <h2>Name your theme</h2>
            <form className="modal__form" onSubmit={this.handleExportClick}>
              <label>
                Give your theme a descriptive name.
                <input
                  id="themeName"
                  value={themeName}
                  onChange={this.handleThemeNameChange}
                  required={true}
                  type="text"
                  maxLength="32"
                  placeholder="Theme name"
                />
              </label>
            </form>
            {this.renderNext(this.handleExportClick)}
          </>
        );
      default:
        return null;
    }
  }

  render() {
    const { shouldShowExportThemeDialog } = this.props;
    return (
      <Modal
        toggleModal={() => this.handleClose()}
        displayModal={shouldShowExportThemeDialog}
      >
        {this.renderContent()}
      </Modal>
    );
  }
}

export default ExportThemeDialog;
