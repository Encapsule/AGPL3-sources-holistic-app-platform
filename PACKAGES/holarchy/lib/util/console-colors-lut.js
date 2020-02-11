"use strict";

var holarchyConsoleStylesLUT = {
  error: "color: yellow; background-color: red; font-weight: bold; font-size: larger;",
  opc: {
    constructor: {
      prologue: "border-left: 6px solid #FF6600; border-top: 6px solid #FFCC00; padding: 0.25em; padding-left: 0.5em; background-color: #FF9900; color: black; font-weight: bold;",
      body: "border-left: 6px solid #FF6600; padding-left: 0.5em; background-color: #FFCC99; color: black;",
      epilogue: "border-left: 6px solid #FF6600; border-bottom: 6px solid #CC0000; padding: 0.25em; padding-left: 0.5em; background-color: #FF9900; color: black; font-weight: bold;"
    },
    act: {
      borderColor: "#009900",
      borderTopColor: "#00FF00",
      borderBottomColor: "#006600",
      prologue: "padding-left: 0.5em; background-color: #99FF99; color: black; font-weight: bold; font-size: smallest;",
      body: "padding-left: 0.5em; background-color: #CCFFCC; color: black; font-size: smallest;",
      epilogue: "padding-left: 0.5em; background-color: #99FF99; color: black; font-weight: bold; font-size: smallest;"
    },
    evaluate: {
      prologue: "margin-left: 12px; border-left: 6px solid #0099FF; border-top: 6px solid #DDEEFF; padding-left: 0.5em; background-color: #99CCFF; color: black; font-weight: bold; font-size-smallest;",
      body: "margin-left: 12px; border-left: 4px solid #00CCFF; padding-left: 0.5em; background-color: #DDEEFF; color: black; font-weight: normal; font-size: smallest;",
      epilogue: "margin-left: 12px; border-left: 6px solid #0099FF; border-bottom: 6px solid #0000CC; padding-left: 0.5em; background-color: #99CCFF; color: black; font-weight: bold; font-size: smallest;"
    }
  }
};
module.exports = holarchyConsoleStylesLUT;