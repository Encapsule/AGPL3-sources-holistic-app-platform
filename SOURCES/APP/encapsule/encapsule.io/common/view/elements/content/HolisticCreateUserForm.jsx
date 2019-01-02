// HolisticCreateUserForm.jsx

/*
  The server-side portion of the application requires that form data
  be submitted in a known and precise JSON format. The format is specified
  by a shared Encapsule/arccore.filter specification object. Enforcement of the
  contract is performed in generic library code with an Encapsule/hrequest
  filter in the context of the client-side JavaScript application. And, on
  the server by a Encapsule/holism service filter registered to handle
  HTTP POST:/site_admin/account/create requests.

  Here we need to render the actual HTML form that someone will fill out
  to create a user account on the server. Rather than hard code the form fields,
  we leverage the shared filter specification's regular format to automate
  the assembly of the form. In this way, we really only need to update the
  filter specification document and rebuild the application in order to
  udpate the form view, and all the data processing all the way back to Redis.

  TODO: Convert this into a generic universal form renderer.
*/

const arccore = require('arccore');
const React = require('react');
const HolisticIconPageHeader = require('../common/HolisticIconPageHeader.jsx');
const clientUserProfileSpec = require('../../../../common/iospecs/app/client-user-account-create-request-spec');

module.exports = React.createClass({

    displayName: "HolisticNewAccountForm",

    getInitialState: function() {
        var initialState = {};
        for (var key in clientUserProfileSpec) {
            // Skip filter specification directives.
            if (key.startsWith('____')) {
                continue;
            }
            // Dereference the current filter specification namespace object.
            var nsDescriptor = clientUserProfileSpec[key];
            initialState[key] = nsDescriptor.____defaultValue; // often undefined but React requires explicit unset of state properties.
        }
        return (initialState);
    },

    onTextInputUpdate: function(event_) {
        var state = this.state;
        var propertyName = event_.target.name;
        var propertyValue = event_.target.value;
        if (propertyName === 'username') {
            propertyValue = propertyValue.toLowerCase();
        }
        state[propertyName] = propertyValue;
        this.setState(state);
    },

    onFormReset: function(event_) {
        console.log("Form contents reset to default values.");
        this.setState(this.getInitialState());
        event_.preventDefault();
    },

    onFormSubmit: function(event_) {
        console.log("Form contents submit...");
        this.props.appStateContext.viewActions.userAccountCreate(this.state);
        event_.preventDefault();
    },

    render: function() {

        var index = 0;
        function makeKey() { return ("HolisiticNewAccountForm" + index++); }

        const theme = this.props.document.metadata.site.theme;
        const pageMetadata = this.props.document.metadata.page;

        var formInputs = [];

        // Enumerate all the top-level keys in the filter specification.
        var keyCount = 0;
        for (var key in clientUserProfileSpec) {

            // Do not render arccore.filter specification directives as form inputs.
            if (key.startsWith('____')) {
                continue;
            }

            // Dereference the current filter specification namespace object.
            var nsDescriptor = clientUserProfileSpec[key];

            var appdsl = nsDescriptor.____appdsl;

            // Insert a new form input.
            var holisticFormInputBlockStyles = arccore.util.clone(theme.holisticFormInputBlock); // deep copy
            holisticFormInputBlockStyles.marginTop = (keyCount?'0.5em':'0px');

            var requiredInput = ((nsDescriptor.____defaultValue === undefined)?true:false);
            var autofocusInput = (keyCount?false:true);

            var inputCurrentValue = this.state[key]?this.state[key]:"";

            formInputs.push(<div key={makeKey()} style={holisticFormInputBlockStyles}>
                            <strong>{nsDescriptor.____label}</strong><br />
                            <p>{nsDescriptor.____description}</p>
                            <input type={appdsl.formInput.type} value={inputCurrentValue} onChange={this.onTextInputUpdate}
                            name={key} required={requiredInput} autoFocus={autofocusInput} />
                            {' '}({requiredInput?"required":"optional"})
                            </div>
                           );

            keyCount++;

        } // end for

        return (<div>
                <HolisticIconPageHeader svg={pageMetadata.icons.svg} title="Create User Account"
                subtitle={"Please fill out this form to create a new " + this.props.document.metadata.site.name + " account."} />
                <div style={theme.holisticFormBlock}>
                {formInputs}
                </div>
                <div style={theme.holisticFormSubmitBlock}>
                <button onClick={this.onFormReset} style={{ float: 'left'}}>Reset</button>
                {' '}
                <button onClick={this.onFormSubmit} style={{ float: 'right'}}>Submit</button>
                <div style={{ clear: 'both'}} />
                </div>
                </div>
               );

    }

});
