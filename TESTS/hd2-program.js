
module.exports =  [

    {
        id: "iyZKjcvmR7OsORGfvAZtPQ",
        name: "Holodeck Package Tests",
        description: "@encapsule/holodeck RTL package tests.",
        config: {
            package: {
                packageName: "@encapsule/holodeck",
                programRequest: {
                    id: "k2NqyrK1TA-t7LrZGewUhg",
                    name: "Holodeck RTL Tests",
                    description: "Base-level regression tests for @encapsule/holodeck RTL package",
                    config: {
                        testSet: {
                            programRequest: [
                                {
                                    id: "9uAsdIezSSWUKs9yDExkdg",
                                    name: "Test #1",
                                    description: "blah blah blah",
                                    test: {
                                        holistic: {
                                            holodeck: {
                                                constructorRequest: {
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        }
    },

    /*

    {
        id: "CgS0a4bPT7u4998vzQmn9Q",
        name: "Holarchy Package Tests",
        description: "@encapsule/holarchy RTL package tests.",
        config: {
            package: {
                packageName: "@encapsule/holarchy",
                programRequest:[
                    {
                        id: "J0aFcS-fR1azIjp_A2J76g",
                        name: "ControllerAction Class",
                        description: "Base-level regression tests for @encapsule/holarchy ControllerAction class.",
                        config: {
                            class: {
                                className: "ControllerAction",
                                programRequest:{
                                }
                            }
                        }
                    }
                ]
            }
        }
    },
    {
        id: "OqTc6fE9RE6ZJTkLR07DuQ",
        name: "Holarchy CellModel Package Tests",
        description: "@encapsule/holarchy-cm RTL package tests.",
        config: {
            package: {
                packageName: "@encapsule/holarchy-cm",
                programRequest:[
                ]
            }
        }
    },
    {
        id: "kH8KUtOzQNWtBl88rMlMtQ",
        name: "Holistic App Client CellModel Package Tests",
        description: "@encapsule/holistic-app-client-cm RTL package tests.",
        config: {
            package: {
                packageName: "@encapsule/holistic-app-client-cm",
                programRequest:[
                ]
            }
        }
    },
    {
        id: "EdsWkH9BTFK1SBDxGxMCUQ",
        name: "Holistic App Server CellModel Package Tests",
        description: "@encapsule/holistic-app-server-cm RTL package tests.",
        config: {
            package: {
                packageName: "@encapsule/holistic-app-server-cm",
                programRequest:[
                ]
            }
        }
    }


    */
];

