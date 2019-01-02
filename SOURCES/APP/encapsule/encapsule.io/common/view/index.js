// common/view/index.jsx

module.exports = {
    render: require('./elements/page/HolisticPage.jsx'),
    theme: require('./theme'),
    contentRouterFactory: require('./elements/content-router') // function that accepts integrations filter object
};
