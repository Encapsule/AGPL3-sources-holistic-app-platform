

const holarchyConsoleStylesLUT = {
    error: "color: yellow; background-color: red; font-weight: bold; font-size: larger;",
    opc: {
        constructor: {
            prologue: "border-left: 4px solid red; padding-left: 0.5em; background-color: #F0F0F0; color: red; font-weight: bold; font-size: larger;",
            epilogue: "border-left: 4px solid red; padding-left: 0.5em; background-color: #F0F0F0; color: red; font-weight: bold; font-size: larger;"
        },
        act: {
            prologue: "border-left: 4px solid #FFCC00; padding-left: 0.5em; background-color: #FFFFCC; color: black; font-weight: bold;",
            body: "color: #CC0066; font-weight: bold;",
            prologue: "border-left: 4px solid #FFCC00; padding-left: 0.5em; background-color: #FFFFCC; color: black; font-weight: bold;",

        },
        evaluate: {
            epilogue: "border-left: 4px solid #00CCFF; padding-left: 0.5em; background-color: #DDEEFF; color: blue; font-weight: bold;",
            body: "border-left: 4px solid #00CCFF; padding-left: 0.5em; color: black; font-weight: normal; background-color: #FFF0E7;",
            prologue: "border-left: 4px solid #00CCFF; padding-left: 0.5em; background-color: #DDEEFF; color: blue; font-weight: bold;"
        }
    }

};

module.exports =  holarchyConsoleStylesLUT;

