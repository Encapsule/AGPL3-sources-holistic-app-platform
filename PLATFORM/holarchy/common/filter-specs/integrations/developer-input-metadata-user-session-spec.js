"use strict";

// developer-input-metadata-user-session-spec.js
module.exports = {
  ____label: "User Session Descriptor",
  ____description: "Object containing information about an authenticated user.",
  ____types: "jsObject",
  ____defaultValue: {},
  user: {
    ____label: "User Identity Information",
    ____types: "jsObject",
    ____defaultValue: {},
    username: {
      ____label: "Username",
      ____accept: "jsString",
      ____defaultValue: "anonymous"
    },
    name: {
      ____label: "User Name",
      ____types: "jsObject",
      ____defaultValue: {},
      first: {
        ____label: "First Name",
        ____accept: "jsString",
        ____defaultValue: "Anonymous"
      },
      last: {
        ____label: "Last Name",
        ____accept: "jsString",
        ____defaultValue: "User"
      }
    },
    // name
    email: {
      ____label: "E-mail Address",
      ____accept: "jsString",
      ____defaultValue: "anonymous@inter.net"
    }
  },
  // user
  settings: {
    ____label: "Persistent User Settings",
    ____accept: "jsObject",
    // TODO: tighten this up once stable
    ____defaultValue: {}
  }
};