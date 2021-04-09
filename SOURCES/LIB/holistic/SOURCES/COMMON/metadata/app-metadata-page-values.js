// app-metadata-page-values.js

const appBuildManifest = require("../../app-build");

module.exports = {
    "/": {
        title: appBuildManifest.app.name,
        description: appBuildManifest.app.description,
        name: appBuildManifest.app.name,
        tooltip: `${appBuildManifest.app.name}...`
    },

    "/login-oauth2": {
        title: "${appBuildManifest.app.name} Login",
        description: "Integration w/Google OAuth2 to gain access to Viewpath5 user metadata associated w/their Google account (e.g. name, e-mail, Google user ID). We use this to verify identity currently.",
        name: "${appBUildManifest.appName} Login",
        tooltip: `Log in ${appBuildManifest.app.name}...`
    }

};
