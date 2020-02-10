

const holarchyConsoleStylesLUT = {
    error: "color: yellow; background-color: red; font-weight: bold; font-size: larger;",
    opc: {
        constructor: {
            prologue: "border-left: 4px solid yellow; border-top: 4px solid yellow; padding: 0.25em; padding-left: 0.5em; background-color: #FFFFCC; color: black; font-weight: bold;",
            body: "border-left: 4px solid yellow; padding-left: 0.5em; background-color: #FFFF99; color: black;",
            epilogue: "border-left: 4px solid yellow; border-bottom: 4px solid yellow; padding: 0.25em; padding-left: 0.5em; background-color: #FFFFCC; color: black; font-weight: bold;"
        },
        act: {
            borderColor: "#00FF00",
            prologue: "padding-left: 0.5em; background-color: #99FF99; color: black; font-weight: bold; font-size: smallest;",
            body: "padding-left: 0.5em; background-color: #CCFFCC; color: black; font-size: smallest;",
            epilogue: "padding-left: 0.5em; background-color: #99FF99; color: black; font-weight: bold; font-size: smallest;",

        },
        evaluate: {
            prologue: "border-left: 8px solid #00CCFF; border-top: 8px solid #00CCFF; padding-left: 0.5em; background-color: #BBDDFF; color: black; font-weight: bold; font-size-smallest;",
            body: "border-left: 8px solid #00CCFF; padding-left: 0.5em; background-color: #DDEEFF; color: black; font-weight: normal; font-size: smallest;",
            epilogue: "border-left: 8px solid #00CCFF; border-bottom: 8px solid #00CCFF; padding-left: 0.5em; background-color: #BBDDFF; color: black; font-weight: bold; font-size: smallest;"
        }
    }
};

module.exports =  holarchyConsoleStylesLUT;

