// common/view/elements/content-router/index.js
//
// This module exports a filter that accepts an Encapsule/holism-generated
// application integration filters object and constructs a dynamic content router.

const arccore = require('arccore');

const contentViewRouterFilterFactory = require('./content-view-router-filter-factory');

// React components responsible for rendering top-level page content.

const HolisticError = require('../content/HolisticError.jsx');
const HolisticErrorViewRenderSpec = require('holism/lib/iospecs/http-response-error-result-spec').error_descriptor.data;

const HolisticCreateUserAccountForm = require('../content/HolisticCreateUserForm.jsx');
const HolisticCreateUserAccountFormViewRenderSpec = require('../../../iospecs/view/content-view-render-create-account-spec');

const HolisticSitemap = require('../content/HolisticSitemap.jsx');
const HolisticSitemapContentViewRenderSpec = require('../../../iospecs/view/content-view-render-sitemap-spec');

const HolisticLogin = require('../content/HolisticLogin.jsx');
const HolisticLoginContentViewRenderSpec = require('../../../iospecs/view/content-view-render-login-spec');

const Logout = require('../content/HolisticLogout.jsx');
const LogoutContentViewRenderSpec = require('../../../iospecs/view/content-view-render-logout-spec');

const MarkdownContent = require('../content/HolisticMarkdown.jsx');
const MarkdownContentViewRenderSpec = require('../../../iospecs/view/content-view-render-markdown-spec');

const HolisticStaticCollectionView = require('../content/HolisticStaticCollectionView.jsx');
const HolisticStaticCollectionViewRenderSpec = require('../../../iospecs/view/content-view-render-view-store-collection-spec');

const HolisticSoftwarePackageOverview = require('../content/HolisticSoftwarePackageOverview.jsx');
const HolisticSoftwarePackageDatasheetSpec = require('../../../iospecs/view/content-view-render-software-package-datasheet-spec');

const HolisticDocLibraryPageView = require('../content/HolisticDocLibraryPageView.jsx');
const HolisticDocLibraryPageViewRenderRequestSpec = require('../../../iospecs/view/content-view-render-doc-lib-page-view-spec');

const HolisticSoftwareLibraryOverview = require('../content/HolisticSoftwareLibraryOverview.jsx');
const HolisticSoftwareLibraryViewRenderSpec = require('../../../iospecs/view/content-view-render-software-library-datasheet-spec');

const HolisticSoftwareFactoryOverview = require('../content/HolisticSoftwareFactoryOverview.jsx');
const HolisticSoftwareFactoryViewRenderSpec = require('../../../iospecs/view/content-view-render-software-factory-datasheet-spec');

const AppViewARCcoreFilterExamples = require('../content/AppViewARCcoreFilterExamples.jsx');
const AppViewARCcoreFilterExamplesRenderSpec = require('../../../iospecs/view/app-view-render-filter-examples-spec');

const AppViewD3Examples = require('../content/AppViewD3Examples.jsx');
const AppViewD3ExamplesRenderSpec = require('../../../iospecs/view/app-view-render-d3-examples-spec');

var factoryResponse = contentViewRouterFilterFactory.request({
    seed: "KLVfjF6dReuScyk_jMiZ9g",
    contentViewDataBindings: [

        {
            name: "Error Content View Router",
            description: "Renders a server or client application runtime error message as HTML content.",
            dataBindingSpec: HolisticErrorViewRenderSpec,
            reactComponent: HolisticError
        },

        {
            name: "Create Account View Router",
            description: "Renders the create new user account form as HTMLT content.",
            dataBindingSpec: HolisticCreateUserAccountFormViewRenderSpec,
            reactComponent: HolisticCreateUserAccountForm
        },

        {
            name: "Login Content View Router",
            description: "Renders the site login form as HTML content.",
            dataBindingSpec: HolisticLoginContentViewRenderSpec,
            reactComponent: HolisticLogin
        },

        {
            name: "Logout Content View Router",
            description: "Renders the site logout form as HTML content.",
            dataBindingSpec: LogoutContentViewRenderSpec,
            reactComponent: Logout
        },

        {
            name: "Markdown Content View Router",
            description: "Renders markdown text as HTML content.",
            dataBindingSpec: MarkdownContentViewRenderSpec,
            reactComponent: MarkdownContent
        },

        {
            name: "Sitemap Content View Router",
            description: "Renders a hiearchical representation of the public pages hosted by this website as HTML content.",
            dataBindingSpec: HolisticSitemapContentViewRenderSpec,
            reactComponent: HolisticSitemap
        },

        {
            name: "View Store Collection Content View Router",
            description: "Renders a hiearchical representation of subpages of the current pages registered in the view store.",
            dataBindingSpec: HolisticStaticCollectionViewRenderSpec,
            reactComponent: HolisticStaticCollectionView
        },

        {
            name: "Software Package Overview View Router",
            description: "Routes request to render a software package datasheet as an HTML page view.",
            dataBindingSpec: HolisticSoftwarePackageDatasheetSpec,
            reactComponent: HolisticSoftwarePackageOverview
        },

        {
            name: "Software Library Overview View Router",
            description: "Routes request to render a software library datasheet as an HTML page view.",
            dataBindingSpec: HolisticSoftwareLibraryViewRenderSpec,
            reactComponent: HolisticSoftwareLibraryOverview
        },

        {
            name: "Software Factory Overview View Router",
            description: "Routes request to render a software factory datasheet as an HTML page view.",
            dataBindingSpec: HolisticSoftwareFactoryViewRenderSpec,
            reactComponent: HolisticSoftwareFactoryOverview
        },

        {
            name: "ARCcore.filter Examples App View Router",
            description: "Routes request to render ARCcore.filter examples data as an HTML page view.",
            dataBindingSpec: AppViewARCcoreFilterExamplesRenderSpec,
            reactComponent: AppViewARCcoreFilterExamples
        },

        {
            name: "D3 Examples App View Router",
            description: "Routes request to render D3 Examples data an an HTML page view.",
            dataBindingSpec: AppViewD3ExamplesRenderSpec,
            reactComponent: AppViewD3Examples
        }

    ]
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

// View content data to view render function router.
module.exports = factoryResponse.result;
