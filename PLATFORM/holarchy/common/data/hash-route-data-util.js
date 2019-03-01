"use strict";

// sources/common/data/hash-route-data-util.js
// eslint

/* global location */

/**
   Utility function for getting data to/from location.hash
**/

/**
  Given a string of form '#key1=value1&key2=value2'
  extract a value for the passed key
**/
var getValueForKey = function getValueForKey(key, hashLocation) {
  var result;
  var hash = hashLocation.replace("#", "");
  var parsed = hash.split("&");
  parsed.forEach(function (element) {
    if (element.indexOf(key + "=") >= 0) {
      result = element.split("=")[1];
    }
  });
  return result;
};
/**
Write an object to key in the hash route.
**/


var writeHashRoute = function writeHashRoute(key, object) {
  var json = JSON.stringify(object);
  var buf = Buffer.from(json);
  var base64 = buf.toString("base64");

  while (base64.indexOf("+") >= 0) {
    base64 = base64.replace("+", "_");
  }

  while (base64.indexOf("/") >= 0) {
    base64 = base64.replace("/", "-");
  }

  var hash = location.hash;
  hash = hash.replace("#", "");
  var hashList = [];

  if (hash.indexOf(key + "=") > 0) {
    hashList = hash.split("&");
    hashList = hashList.filter(function (element) {
      element.indexOf(key + "=") < 0;
    });
  }

  location.hash = hashList.join("") + "&" + key + "=" + base64;
  return base64;
};
/**
   Given a hash locatin value and a key, extract the value and a deserialized object.
**/


var deserializeObjectFromHashRoute = function deserializeObjectFromHashRoute(key, hashLocation) {
  var result = {
    serializedValue: null,
    extractedValue: null
  };
  var base64 = getValueForKey(key, hashLocation);
  result.serializedValue = base64;

  if (!base64) {
    return result;
  } //undo the URL safe string substitutions on base64 encoding


  while (base64.indexOf("_") >= 0) {
    base64 = base64.replace("_", "+");
  }

  while (base64.indexOf("-") >= 0) {
    base64 = base64.replace("-", "/");
  }

  var json = Buffer.from(base64, "base64");
  result.extractedValue = JSON.parse(json);
  return result;
};

module.exports = {
  writeHashRoute: writeHashRoute,
  deserializeObjectFromHashRoute: deserializeObjectFromHashRoute
};