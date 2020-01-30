

const holarchyConsoleStylesLUT = {
    error: "color: yellow; background-color: red; font-weight: bold; font-size: larger;",
    opc: {
        constructor: {
            entry: "color: blue; font-weight: bold; font-size: larger;",
            success: "color: blue; font-weight: bold; font-size: larger;"
        },
        act: {
            entry: "color: #CC9900; font-weight: bold; font-size: larger;",
            levelN: "color: #CC0066; font-weight: bold;",
            success: "color: blue; font-weight: bold; font-size: larger;"
        },
        evaluate: {
            entry: "padding-left: 1em; color: blue; font-weight: bold; font-size: larger;",
            entryDetails: "padding-left: 2em; color: blue; font-weight: normal; font-style: italic;",
            transition: "padding-left: 2em; color: blue; font-weight: normal;",
            success: "padding-left: 1em; color: blue; font-weight: bold; font-size: larger"
        }
    }
};

module.exports =  holarchyConsoleStylesLUT;

