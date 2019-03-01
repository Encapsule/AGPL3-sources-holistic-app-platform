"use strict";

// storage-user-session-descriptor-spec.js
module.exports = {
  ____label: "User Session Storage Descriptor",
  ____description: "User session descriptor format as read/written from Redis.",
  ____types: "jsObject",
  username_sha256: {
    ____label: "Username Hash",
    ____description: "The SHA256 digest hash of the username who owns this session.",
    ____accept: "jsString"
  },
  created: {
    ____label: "Created At",
    ____description: "ISO timestamp this session was created by the application server.",
    ____accept: "jsString"
  }
};