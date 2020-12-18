// holistic-tab-service-exception-display.js

const arccore = require("@encapsule/arccore");

(function() {

    const containerStyles = [
        "margin: 64px",
        "padding: 2em",
        "border-radius: 0.5em",
        "border: 1em solid #999999",
        "background-color: red",
        "font-family: Play",
        "font-size: 14pt",
        "box-shadow: 0.1em 0.1em 1em 0.05em rgba(0,0,0,0.3)",
        "background-image: url(/images/warning-error-icon.svg)",
        "background-position: center",
        "background-repeat: no-repeat",
        "color: black"
    ].join("; ");

    const headingIconStyles = [
        "width: 64px",
        "height: 64px",
        "position: relative",
        "bottom: -13px",
        "margin-right: 0.33em"
    ].join("; ");

    const initPhaseStyles = [
        "border-radius: 0.33em",
        "border-left: 1em solid #FF9F19",
        "padding: 1em",
        "margin: 0em",
        "font-size: larger",
        "font-family: Roboto",
        "font-weight: bold",
        "background-color: rgba(255,255,255 , 0.6)",
    ].join(";");

    const exceptionPaneStyles = [
        "border: 1px solid rgba(0,0,0,0.1)",
        "border-radius: 0.25em",
        "margin-top: 1em",
        "padding: 1em",
        "box-shadow: 2px 2px 4px 1px rgba(0,0,0,0.33) inset",
        "overflow: auto"
    ].join("; ");

    const exceptionPanePREStyles = [
        "font-family: 'Share Tech Mono'",
        "font-size: 14pt",
        "font-weight: bold"
    ].join("; ");

    const versionContainerAStyles = [
        "display: flex",
        "justify-content: right"
    ].join("; ");

    const versionContainerBStyles = [
        "width: 100%"
    ].join("; ");

    const versionContainerCStyles = [
        "white-space: nowrap",
        "text-align: right",
        "margin-top: 1em",
        "padding: 1em",
        "border-radius: 0.25em",
        "border: 1px solid rgba(0,0,0,0.1)",
        "font-size: 10pt",
        "opacity: 0.6;"
    ].join("; ");


    const factoryResponse = arccore.filter.create({
        operationID: "cln6SPH5RWWI-HzaCcTYXA",
        operationName: "Display Holistic Tab Service Exception",
        operationDescription: "Takes over the tab service's display adapter and uses DOM API's to re-render a fatal tab service exception error message (hopefuly to a developer).",
        inputFilterSpec: {
            ____label: "Tab Service Exception Display Request",
            ____description: "A request sent to override the tab service's display adapter and take direct control of the DOM to display a fatal tab service exception error to the user.",
            ____types: "jsObject",
            appBuild: { ____accept: "jsObject" }, // TODO - we could I guess schematize this but it's okay for now I think.
            headerText: { ____accept: "jsString" },
            errorText: { ____accept: "jsString" },
        },
        outputFilterSpec: { ____accept: "jsUndefined" }, // No response.result - this is fatal EOL. Browser page reload is only option if this filter is called at any phase of the tab service lifecycle.
        bodyFunction: function(request_) {
            console.warn(request_.headerText);
            console.error(`TAB SERVICE FATAL EXCEPTION: ${request_.errorText}`);

            const targetDomElement = document.getElementById("idTabServiceDisplayProcess");
            if (targetDomElement === null) {
                throw new Error("Internal error: document.getElementById('idAppClientUserInterfaceDisplay') returned null value.");
            }

            // targetDomElement.innerHTML = "";

            let componentR = 255;
            let componentG = 255;
            let componentB = 255;
            let opacity = 1;
            let interval1 = setInterval(function() {
                componentR -= 1.4;
                componentG -= 3;
                componentB -= 2;
                opacity -= 0.03;
                document.body.style.backgroundColor = `rgb(${Math.max(0,componentR)},${Math.max(0,componentG)},${Math.max(0,componentB)})`;
                targetDomElement.setAttribute("style", `opacity: ${Math.max(0,opacity)}`);
                if ((componentR <= 0) && (componentG <= 0) && (componentB <=0) && (opacity <=0)) {
                    clearInterval(interval1);
                    const innerHTML = `
<div style="${containerStyles}" id="client-app-error">
  <h1><img src="/images/warning-error-icon.svg" style="${headingIconStyles}"></img>${request_.appBuild.app.name} v${request_.appBuild.app.version}-${request_.appBuild.app.codename}</h1>
  <h2>Fatal Exception in ${request_.appBuild.app.name} Tab Service Process</h2>
  <p>Sorry to report that the ${request_.appBuild.app.name} tab service has crashed due to a fatal exception.</p>
  <p>To get to the bottom of this:
  <ul><li>Read the error carefully.</li><li>Set breakpoints.</li><li>Then, <a href="/">reboot</a> the tab service.</li></ul>
  </p>
  <div style="${initPhaseStyles}">
  <p>${request_.headerText}</p>
  <div style="${exceptionPaneStyles}">
    <div style="${exceptionPanePREStyles}">${request_.errorText}</div>
  </div>

</div>
  <div style="${versionContainerAStyles}">
    <div style="${versionContainerBStyles}"></div>
      <div style="${versionContainerCStyles}">
        ${request_.appBuild.app.name} v${request_.appBuild.app.name}-${request_.appBuild.app.codename}<br/>
        ${request_.appBuild.app.buildID} ${request_.appBuild.app.buildDateISO}<br/>
        ${request_.appBuild.app.buildSource}<br/>
      </div>
    </div>
  </div>
</div>
`;
                    targetDomElement.innerHTML = innerHTML;
                    document.body.style.backgroundColor = "black";

                    componentR = componentG = componentB = opacity = 0;
                    let interval2 = setInterval(function() {
                        componentR += 3;
                        componentG += 2;
                        componentB += 4;
                        opacity += 0.2;
                        document.body.style.backgroundColor = `rgb(${Math.min(255,componentR)},${Math.min(255,componentG)},${Math.min(255,componentB)})`;
                        targetDomElement.setAttribute("style", `opacity: ${Math.min(1,opacity)}`);

                        if ((componentR >= 255) && (componentG >= 255) && (componentB >= 255) && (opacity >= 1)) {
                            console.log("Okay... done screwing around w/the DOM styles. Go fix your bug(s) :-)");
                            clearInterval(interval2);
                        }
                    }, 5);
                }
            }, 5);

            return { error: null };
        } // bodyFunction
    }); // filter factory

    if (factoryResponse.error) {
        throw new Error(factoryResponse.error);
    }

    module.exports = factoryResponse.result;

})();

