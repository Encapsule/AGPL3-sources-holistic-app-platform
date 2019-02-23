// rainier-ux-base/sources/common/view/elements/component/RUXBase_PageContent_AppError.jsx

const React = require('react');
const reactComponentBindingFilterFactory = require('rainier-ux-base/common').factories.view.reactComponentBindingFilter;

class RUXBase_PageContent_AppError extends React.Component {

  render() {
    const metadata = this.props.document.metadata;
    const theme = metadata.site.theme;
    const renderData = this.props.renderData.RUXBase_PageContent_AppError;
    return ( 
      <div style={theme.base.RUXBase_PageContent_AppError.container} >
        <h2>{metadata.site.name} Application Error</h2>
          <p style={theme.base.RUXBase_PageContent_AppError.errorMessage}>{renderData.error_message}</p>
      </div>);
  }
}

var factoryResponse = reactComponentBindingFilterFactory.request({
  id: "jBKQjQ1tTJy_xlHZUthfkA",
  name: "RUXBase_PageContent_AppError",
  description: "Filter spec for bound component to render application errors",
  renderDataBindingSpec: {
    ____types: "jsObject",
    RUXBase_PageContent_AppError: {
      ____types: "jsObject",
      error_message: {
        ____accept: "jsString",
        ____defaultValue: "RUX Application Error"
      }
    }
  },
  reactComponent: RUXBase_PageContent_AppError
});

if (factoryResponse.error)
  throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
