// client-user-create-request-spec.js
/*
  Defines the format of a user profile descriptor object that is transmitted from client to server
  in the context of user account create by site administrator.
*/


module.exports = {
    ____label: "Client User Account Request Descriptor",
    ____description: "Create new user account form data.",
    ____types: "jsObject",

    username: {
        ____label: "Username",
        ____description: "Enter the username you would like to use for login. Username is always lowercase.",
        ____accept: "jsString",
        ____appdsl: { formInput: { type: "text" } }
    },

    firstName: {
        ____label: "First Name",
        ____description: "What is your first name.",
        ____accept: "jsString",
        ____appdsl: { formInput: { type: "text" } }
    },

    lastName: {
        ____label: "Last Name",
        ____description: "What is your last name.",
        ____accept: "jsString",
        ____appdsl: { formInput: { type: "text" } }
    },

    password1: {
        ____label: "Password",
        ____description: "Enter your desired password.",
        ____accept: "jsString",
        ____appdsl: { formInput: { type: "password" } }
    },

    password2: {
        ____label: "Password (confirm)",
        ____description: "Enter the same password again to verify.",
        ____accept: "jsString",
        ____appdsl: { formInput: { type: "password" } }
    },

    email: {
        ____label: "E-mail",
        ____description: "What e-mail address can we use to send you account recovery information?",
        ____accept: "jsString",
        ____appdsl: { formInput: { type: "email" } }
    },

    location: {
        ____label: "Location",
        ____description: "What is your location?",
        ____accept: [ "jsNull", "jsString" ],
        ____defaultValue: null,
        ____appdsl: { formInput: { type: "text" } }
    },

    website: {
        ____label: "Website",
        ____description: "Add your personal website if you would like it listed in your user profile.",
        ____accept: [ "jsNull", "jsString" ],
        ____defaultValue: null,
        ____appdsl: { formInput: { type: "url" } }
    },

    github: {
        ____label: "GitHub",
        ____description: "What is your GitHub username?",
        ____accept: [ "jsNull", "jsString" ],
        ____defaultValue: null,
        ____appdsl: { formInput: { type: "text" } }
    },

    twitter: {
        ____label: "Twitter",
        ____description: "What is your Twitter handle?",
        ____accept: [ "jsNull", "jsString" ],
        ____defaultValue: null,
        ____appdsl: { formInput: { type: "text" } }
    }

};




