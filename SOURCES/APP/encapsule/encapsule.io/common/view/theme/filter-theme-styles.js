// filter-theme-styles.js

const ARCCORE = require('arccore');

var filterFactory = ARCCORE.filter.create({
    operationID: "mkL59JrCRpqdRpfwdW5jYw",
    operationName: "Snapsite Theme Styles Filter",
    operationDescription: "Constructs a snapsite theme styles object.",

    inputFilterSpec: {
        ____label: "Theme Styles Descriptor",
        ____description: "snapsite theme styles data descriptor",
        ____types: "jsObject",
        ____defaultValue: {},

        pageContent: {
            ____label: "Body Styles",
            ____description: "Styles to apply to each page's BODY tag.",
            ____types: "jsObject",
            ____defaultValue: {
                margin: '0px',
                padding: '0px',
                margin: 'none',
                backgroundColor: "red"
            }
        },

        link: {
            ____label: "Internal Link Styles",
            ____description: "Styles to apply to internal A tags.",
            ____accept: "jsObject",
            ____defaultValue: {
                textDecoration: 'none',
                color: '#06C',
                borderBottom: '1px solid #F0F0F0'
            },
        },

        linkHover: {
            ____label: "Internal Link Hover Styles",
            ____description: "Styles to apply to simulated internal A tag hover.",
            ____accept: "jsObject",
            ____defaultValue: {
                textDecoration: 'none',
                color: '#F90',
                borderBottom: '1px solid #F90'
            },
        },

        linkLoading: {
            ____label: "Internal Link Loading Styles",
            ____description: "Styles to apply to simulated internal A tag clicked.",
            ____accept: "jsObject",
            ____defaultValue: {
                textDecoration: 'none',
                color: '#00F',
                borderBottom: '1px solid #00F',
                textShadow: '0px 0px 16px #9CF'
            }

        },

        xlink: {
            ____label: "External Link Styles",
            ____description: "Styles to apply to external A tags.",
            ____accept: "jsObject",
            ____defaultValue: {
                textDecoration: 'none',
                color: '#09C',
                borderBottom: '1px solid #F0F0F0'
            }
        },

        xlinkHover: {
            ____label: "External Link Hover Styles",
            ____description: "Styles to apply to simulated external A tag hover.",
            ____accept: "jsObject",
            ____defaultValue: {
                textDecoration: 'none',
                color: '#F90',
                borderBottom: '1px solid #F90'
            }
        }


    }


});

if (filterFactory.error) {
    throw new Error(filterFactory.error);
}

module.exports = filterFactory.result.request;
