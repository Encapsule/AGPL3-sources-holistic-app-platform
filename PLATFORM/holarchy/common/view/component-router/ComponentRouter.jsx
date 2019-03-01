"use strict";

// sources/common/view/content-router/ComponentRouter.jsx
//
var React = require('react');

module.exports = function (dataViewBindingDiscriminator_, dataViewBindingFilters_) {
  var keyIndex = 500;

  function makeKey() {
    return "ComponentRouter" + keyIndex++;
  }

  var dataViewBindingDiscriminator = dataViewBindingDiscriminator_;
  var dataViewBindingFilters = dataViewBindingFilters_;
  var filterNameList = [];
  var filterNameMap = {};
  var filterIDMap = {};
  dataViewBindingFilters.forEach(function (dataViewBindingFilter_) {
    var filterName = dataViewBindingFilter_.filterDescriptor.operationID + '::' + dataViewBindingFilter_.filterDescriptor.operationName;
    filterNameList.push(filterName);
    filterNameMap[filterName] = dataViewBindingFilter_;
    filterIDMap[dataViewBindingFilter_.filterDescriptor.operationID] = dataViewBindingFilter_;
  });
  filterNameList.sort(function (a, b) {
    var aName = a.split('::')[1];
    var bName = b.split('::')[1];
    var disposition = aName > bName ? 1 : aName === bName ? 0 : -1;
    return disposition;
  });
  var ComponentRouter = React.createClass({
    displayName: 'ComponentRouter',
    getInitialState: function getInitialState() {
      return {};
    },
    onToggleInspectViewBindingFilter: function onToggleInspectViewBindingFilter(filterName_) {
      var state = this.state;
      if (!state[filterName_]) state[filterName_] = {};
      if (state[filterName_].inspect) delete state[filterName_].inspect;else state[filterName_].inspect = filterNameMap[filterName_];
      this.setState(state);
    },
    onMouseOverBindingFilter: function onMouseOverBindingFilter(filterName_) {
      var state = this.state;
      state.mouseOver = filterName_;
      this.setState(state);
    },
    onMouseOutBindingFilter: function onMouseOutBindingFilter(filterName_) {
      var state = this.state;
      delete state.mouseOver;
      this.setState(state);
    },
    render: function render() {
      var self = this;
      keyIndex = 0;
      var error = null;
      var routingDataContext = {
        reactContext: this.props,
        renderData: this.props.renderData
      }; //////////////////////////////////////////////////////////////////////////
      // SELECT: Match the namespace:type-derived signature of routingDataContext.renderData to 1:N registered React component data binding filters.

      var discriminatorResponse = dataViewBindingDiscriminator.request(routingDataContext);

      if (!discriminatorResponse.error) {
        var targetFilterID = discriminatorResponse.result;
        var targetViewBindingFilter = filterIDMap[targetFilterID];
        console.log(["..... <ComponentRouter/> dispatching to [", targetViewBindingFilter.filterDescriptor.operationID, "::", targetViewBindingFilter.filterDescriptor.operationName, "]"].join('')); //////////////////////////////////////////////////////////////////////////
        // DISPATCH: Call the React component data binding filter to generate an instance of its encapsulated React component that is bound to this input data.

        if (targetViewBindingFilter.dependencies.integrations) routingDataContext.integrations = targetViewBindingFilter.dependencies.integrations;
        var targetFilterResponse = targetViewBindingFilter.request(routingDataContext);
        if (!targetFilterResponse.error) // Data-bound React component produced by calling the selected React component data binding filter.
          return targetFilterResponse.result;else // ARCcore.discriminator rejects requests that it can not plausibly match to 1:N registered filters
          // while simultaneously eliminating the other N-1 filters. But, it does this by performing as few
          // operations as possible. This means that the selected filter is selected because all the others
          // will definitely reject this request. And, as it turns out it doesn't much like this request.
          error = targetFilterResponse.error;
      } else error = discriminatorResponse.error; //////////////////////////////////////////////////////////////////////////
      // ERROR: The input data does not have an acceptable namespace:type format.


      console.log("!!! <ComponentRouter/> ERROR: " + error);
      var theme = this.props.document.metadata.site.theme; // Pre-render a JSON-format copy of the specific `this.props.renderData` we cannot identify.

      var renderDataJSON = this.props.renderData === undefined ? React.createElement("span", {
        key: makeKey()
      }, "undefined") : React.createElement("span", {
        key: makeKey()
      }, "'", JSON.stringify(this.props.renderData, undefined, 4), "'");
      var supportedFilterListItems = [];
      filterNameList.forEach(function (filterName_) {
        var filterName = filterName_;
        var listItemContent = [];

        var clickHandler = function clickHandler() {
          self.onToggleInspectViewBindingFilter(filterName);
        };

        var onMouseOverHandler = function onMouseOverHandler() {
          self.onMouseOverBindingFilter(filterName);
        };

        var onMouseOutHandler = function onMouseOutHandler() {
          self.onMouseOutBindingFilter(filterName);
        };

        var filterNameStyles = {};

        if (self.state.mouseOver === filterName) {
          filterNameStyles = theme.ComponentRouterError.filterListItemMouseOver;
        } else {
          if (self.state[filterName_] && self.state[filterName_].inspect) {
            filterNameStyles = theme.ComponentRouterError.filterListItemInspect;
          }
        }

        if (!self.state[filterName_] || !self.state[filterName_].inspect) {
          filterNameStyles.cursor = 'zoom-in';
          listItemContent.push(React.createElement("span", {
            key: makeKey(),
            style: filterNameStyles,
            onClick: clickHandler,
            onMouseOver: onMouseOverHandler,
            onMouseOut: onMouseOutHandler
          }, "[", filterName_, "]"));
        } else {
          filterNameStyles.cursor = 'zoom-out';
          listItemContent.push(React.createElement("span", {
            key: makeKey()
          }, React.createElement("span", {
            style: filterNameStyles,
            onClick: clickHandler,
            onMouseOver: onMouseOverHandler,
            onMouseOut: onMouseOutHandler
          }, "[", filterName_, "]"), React.createElement("br", null), React.createElement("br", null), React.createElement("pre", {
            style: theme.classPRE,
            onMouseOver: onMouseOutHandler,
            onMouseOut: onMouseOutHandler
          }, JSON.stringify(filterNameMap[filterName_], undefined, 4)), React.createElement("br", null)));
        }

        supportedFilterListItems.push(React.createElement("li", {
          key: makeKey()
        }, listItemContent));
      });
      return React.createElement("div", {
        style: theme.ComponentRouterError.container
      }, React.createElement("h1", null, "<ComponentRouter/> Error"), React.createElement("p", null, "<ComponentRouter/> cannot render the value of ", React.createElement("code", null, "this.props.renderData"), " it received because its", ' ', React.createElement("strong", null, "namespace::type"), "-derived data signature does not meet the input filter specification criteria of any of the React", ' ', "component data binding filters registered by this application."), React.createElement("h2", null, "Unrecognized this.props.renderData (JSON):"), React.createElement("pre", {
        style: theme.classPRE
      }, "this.props.renderData === ", renderDataJSON), React.createElement("h2", null, "Underlying ARCcore.discriminator Error"), React.createElement("pre", {
        style: theme.classPRE
      }, error), React.createElement("h2", null, "Registered React Components:"), React.createElement("p", null, "To correct this problem, please ensure that the value passed to <ComponentRouter/> via its ", React.createElement("code", null, "renderData"), " property has", ' ', "a ", React.createElement("strong", null, "namespace::type"), "-derived signature accepted by one of the following data-bound React components:"), React.createElement("ol", {
        style: theme.ComponentRouterError.filterList
      }, supportedFilterListItems));
    }
  });
  return ComponentRouter;
};