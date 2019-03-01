"use strict";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// sources/common/view/elements/component/RUXBase_PageContent_SubviewSummary.jsx
var path = require('path');

var React = require('react');

var reactComponentBindingFilterFactory = require('../binding-factory');

var factoryResponse = reactComponentBindingFilterFactory.create({
  id: "VAqVq3IgTF69dXTFHTLPMA",
  name: "RUXBase_PageContent_SubviewSummary",
  description: "<RUXBase_PageContent_SubviewSummary renders some markdown-encoded content, and a list of links to child views exposed in the app metadata store.",
  renderDataBindingSpec: {
    ____types: "jsObject",
    RUXBase_PageContent_SubviewSummary: {
      ____label: "RUXBase_PageContentSubviewSummary HTML Render Request.",
      ____types: "jsObject",
      renderOptions: {
        ____label: "Render Options",
        ____types: "jsObject",
        ____defaultValue: {},
        showPageTitle: {
          ____label: "Show Page Title",
          ____accept: "jsBoolean",
          ____defaultValue: true
        },
        contentContainerStyles: {
          ____label: "Content Container Styles",
          ____description: "Programmatic style object to apply to the DIV around the content (if there is any).",
          ____accept: "jsObject",
          ____defaultValue: {
            paddingTop: '1em',
            paddingBottom: '1em'
          }
        }
      },
      contentEP: {
        ____label: "Content Extension Point Array",
        ____description: "Expects an array of zero or more objects of arbitrary namespace:type signature to be rendered via <ComponentRouter/> in the order specified.",
        ____types: "jsArray",
        ____defaultValue: [],
        content: {
          ____label: "Content Render Request",
          ____accept: "jsObject"
        }
      }
    }
  },
  reactComponent: React.createClass({
    displayName: "RUXBase_PageContent_SubviewSummary",
    render: function render() {
      try {
        var makeKey = function makeKey() {
          return "RUXBase_PageContent_SubviewSummary" + keyIndex++;
        };

        var makeAbsoluteURI = function makeAbsoluteURI(uriSuffix_) {
          return path.join(deployConfig.appBasePath, uriSuffix_);
        };

        var self = this;
        var ComponentRouter = this.props.appStateContext.reactComponentRouter;
        var metadata = this.props.document.metadata;
        var metadataStore = this.props.appStateContext.appMetadataStore;
        var theme = metadata.site.theme;
        var renderData = this.props.renderData['RUXBase_PageContent_SubviewSummary'];
        var keyIndex = 0;
        var content = [];
        var titleContent = [];
        var breadcrumbLinks = [];
        var siteMetadata = metadataStore.getVertexProperty('__website');
        var deployConfig = siteMetadata.build.buildConfig.deployConfig;

        if (renderData.renderOptions.showPageTitle) {
          if (metadataStore.isVertex(metadata.page.uri)) {
            if (metadata.page.ts.d === 0) {
              // tree depth is zero
              breadcrumbLinks.push(React.createElement("span", {
                key: makeKey(),
                style: theme.base.RUXBase_PageContent_SubviewSummary.breadcrumbsNonLinkTextHighlight
              }, metadata.site.name, " ", metadata.page.name));
            } else {
              var homeMetadata = metadataStore.getVertexProperty('/');

              if (metadata.page.ts.d > 1) {
                // Breadcrumbs...
                var examineURI = metadata.page.uri;

                while (examineURI && examineURI !== '/') {
                  var parentURI = metadataStore.inEdges(examineURI)[0].u;
                  var parentMetadata = metadataStore.getVertexProperty(parentURI);
                  if (parentMetadata.ts.d > 0) breadcrumbLinks.unshift(React.createElement("span", {
                    key: makeKey()
                  }, React.createElement("a", {
                    href: makeAbsoluteURI(parentURI),
                    title: parentMetadata.tooltip
                  }, parentMetadata.name), React.createElement("span", {
                    style: theme.base.RUXBase_PageContent_SubviewSummary.breadcrumbsNonLinkText
                  }, '/')));
                  examineURI = parentURI;
                }
              }

              breadcrumbLinks.unshift(React.createElement("span", {
                key: makeKey(),
                style: theme.base.RUXBase_PageContent_SubviewSummary.breadcrumbsNonLinkText
              }, '::'));
              breadcrumbLinks.unshift(React.createElement("a", {
                key: makeKey(),
                href: makeAbsoluteURI("/"),
                title: homeMetadata.tooltip
              }, metadata.site.name));
              breadcrumbLinks.push(React.createElement("span", {
                key: makeKey(),
                style: theme.base.RUXBase_PageContent_SubviewSummary.breadcrumbsNonLinkTextHighlight
              }, metadata.page.name));
            } // else

          } else {
            breadcrumbLinks.unshift(React.createElement("span", {
              key: makeKey(),
              style: theme.base.RUXBase_PageContent_SubviewSummary.breadcrumbsNonLinkTest
            }, "Missing metadata for page URI", ' ', React.createElement("code", null, metadata.page.uri)));
          } // else

        } // if


        var subContent = [];
        renderData.contentEP.forEach(function (htmlRenderRequest_) {
          subContent.push(React.createElement(ComponentRouter, _extends({
            key: makeKey()
          }, self.props, {
            renderData: htmlRenderRequest_
          })));
        });
        var childViewItems = [];
        var childViewItemsShort = [];

        if (metadataStore.isVertex(metadata.page.uri)) {
          metadata.page.children.forEach(function (childPageViewURI_) {
            var relativeChildUri = childPageViewURI_;

            if (childPageViewURI_.indexOf('/') == 0) {
              relativeChildUri = childPageViewURI_.substring(1);
            }

            var childViewMetadata = metadataStore.getVertexProperty(childPageViewURI_);

            if (childViewMetadata.view_options.show_in_sitemap) {
              childViewItems.push(React.createElement("li", {
                key: makeKey()
              }, React.createElement("a", {
                href: makeAbsoluteURI(relativeChildUri),
                title: childViewMetadata.tooltip
              }, React.createElement("strong", null, childViewMetadata.name)), " - ", childViewMetadata.description));
              childViewItemsShort.push(React.createElement("a", {
                key: makeKey(),
                href: makeAbsoluteURI(relativeChildUri),
                title: childViewMetadata.tooltip
              }, childViewMetadata.name));
              childViewItemsShort.push(React.createElement("span", {
                key: makeKey(),
                style: theme.base.RUXBase_PageContent_SubviewSummary.childViewListShortNonLinkText
              }, '|'));
            }
          });
        }

        if (childViewItemsShort.length) // Remove the trailing divider element.
          delete childViewItemsShort[childViewItemsShort.length - 1]; // Render the breadcrumbs title, description, and short child view list iff enabled.

        if (renderData.renderOptions.showPageTitle) {
          content.push(React.createElement("div", {
            key: makeKey(),
            style: theme.base.RUXBase_PageContent_SubviewSummary.breadcrumbsContainer
          }, breadcrumbLinks));

          if (metadataStore.isVertex(metadata.page.uri)) {
            if (metadata.page.ts.d === 0) {
              // tree depth is zero
              content.push(React.createElement("div", {
                key: makeKey(),
                style: theme.base.RUXBase_PageContent_SubviewSummary.description
              }, metadata.site.description));
            } else {
              content.push(React.createElement("div", {
                key: makeKey(),
                style: theme.base.RUXBase_PageContent_SubviewSummary.description
              }, metadata.page.description));
            }
          } else {
            content.push(React.createElement("div", {
              key: makeKey(),
              style: theme.base.RUXBase_PageContent_SubviewSummary.description
            }, React.createElement("i", null, "No page metadata so no description...")));
          }

          if (childViewItemsShort.length && renderData.contentEP.length) {
            content.push(React.createElement("div", {
              key: makeKey(),
              style: theme.base.RUXBase_PageContent_SubviewSummary.childViewListShort
            }, React.createElement("span", {
              style: theme.base.RUXBase_PageContent_SubviewSummary.childViewListShortNonLinkTextLabel
            }, childViewItemsShort.length > 2 ? 'Sections: ' : 'Section: '), childViewItemsShort));
          }
        }

        content.push(React.createElement("div", {
          key: makeKey(),
          style: renderData.renderOptions.contentContainerStyles
        }, subContent));

        if (childViewItems.length) {
          content.push(React.createElement("div", {
            key: makeKey()
          }, React.createElement("span", {
            style: theme.base.RUXBase_PageContent_SubviewSummary.childViewListShortNonLinkTextLabel
          }, childViewItems.length > 1 ? 'Sections' : 'Section', ":"), React.createElement("ul", {
            key: makeKey()
          }, childViewItems)));
        }

        return React.createElement("div", {
          style: theme.base.RUXBase_PageContent_SubviewSummary.container
        }, content);
      } catch (exception_) {
        return React.createElement("div", null, "Unhandled exception in <RUXBase_PageContent_SubviewSummary/>: ", exception_.toString());
      }
    }
  })
});
if (factoryResponse.error) throw new Error(factoryResponse.error);
module.exports = factoryResponse.result;