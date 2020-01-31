

const holarchyConsoleStylesLUT = {
    error: "color: yellow; background-color: red; font-weight: bold; font-size: larger;",
    opc: {
        constructor: {
            prologue: "border-left: 4px solid red; background-color: #FFEEDD; padding: 0.5em; color: red; font-weight: bold; font-size: larger;",
            epilogue: "border-left: 4px solid red: #FFEEDD; padding: 0.5em; color: red; font-weight: bold; font-size: larger;"
        },
        act: {
            prologue: "color: #CC9900; font-weight: bold;",
            body: "color: #CC0066; font-weight: bold;",
            epilogue: "color: blue; font-weight: bold;"
        },
        evaluate: {
            epilogue: "border-left: 4px solod #00CCFF; padding-left: 1em; color: blue; font-weight: bold;",
            body: "border-left: 4px solid #00CCFF; padding-left: 1em; color: blue; font-weight: normal; background-color: #DDEEFF;",
            prologue: "border-left: 4px solid #00CCFF; padding-left: 1em; color: blue; font-weight: bold;"
        }
    }
};

module.exports =  holarchyConsoleStylesLUT;

