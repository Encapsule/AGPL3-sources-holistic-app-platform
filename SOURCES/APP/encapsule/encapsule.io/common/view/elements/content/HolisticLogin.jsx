// HolisticLogin.jsx
//
// A simplistic React component that renders a login form.
//
// https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms
// https://facebook.github.io/react/docs/forms.html

const crypto = require('crypto');
const arccore = require('arccore');
const React = require('react');
const HolisticIconPageHeader = require('../common/HolisticIconPageHeader.jsx');

export class HolisticLogin extends React.Component {

    constructor(props_) {
        super(props_);
        this.state = {
            username: "",
            username_color: "#FCFCFC",
            username_colors: [],
            username_color_seed: "iouRDX-MRLGeka2jGGwhog",
            password: "",
            password_color: "#FCFCFC",
            password_colors: [],
            password_color_seed: "bBbEUkg6Td6Ryqh5ea2RJw",
            password_show: false
        };
        this.onTextInputChange = this.onTextInputChange.bind(this);
        this.onClickReseed = this.onClickReseed.bind(this);
        this.onLoginFormClear = this.onLoginFormClear.bind(this);
        this.onLoginFormSubmit = this.onLoginFormSubmit.bind(this);
    } // end constructor

    onTextInputChange(event_) {
        var state = this.state;
        var propertyName = event_.target.name;
        var propertyValue = event_.target.value;
        if (propertyName === 'username')
            propertyValue = propertyValue.toLowerCase();

        var colorSeed = state[propertyName + "_color_seed"];

        state[propertyName] = propertyValue;

        if (propertyValue.length) {

            var colors = [];
            var characters0 = propertyValue.split("");
            var characters1 = [];

            while (characters0.length) {
                characters1.push(characters0.shift());
                var partial = characters1.join();
                var m3 = arccore.identifier.hash.fromUTF8(colorSeed + partial);
                var hue = Math.floor(((m3 & 0xFF) / 0xFF) * 360);
                var saturation = Math.floor((((m3 >> 8) & 0xFF) / 0xFF) * 20) + 80;
                var lightness = Math.floor((((m3 >> 16) & 0xFF) / 0xFF) * 40) + 60;
                var color = 'hsl(' + hue + ',' + saturation + '%,' + lightness + '%)';
                colors.push(color);
            }
            state[propertyName + '_colors'] = colors;
            state[propertyName + '_color'] = colors[colors.length - 1];
        } else {
            state[propertyName + '_color'] = "#EEE";
            state[propertyName + '_colors'] = [];
        }
        this.setState(state);
    } // end method onTextInputChange

    onClickReseed(inputName_) {
        var state = this.state;
        state[inputName_ + "_color_seed"] = arccore.identifier.irut.fromEther();
        this.setState(state);
        this.onTextInputChange({ target: { name: inputName_, value: state[inputName_] }});
    }

    onLoginFormClear(event_) {
        this.setState(this.getInitialState());
        event_.preventDefault();
    }

    onLoginFormSubmit(event_) {
        var username_sha256 = crypto.createHash('sha256').update(this.state.username).digest("base64").replace(/\+/g, "-").replace(/\//g, "_");
        var password_sha256 = crypto.createHash('sha256').update(this.state.password).digest("base64").replace(/\+/g, "-").replace(/\//g, "_");

        this.props.appStateContext.viewActions.login({
            username_sha256: username_sha256,
            password_sha256: password_sha256
        });

        // Bling
        var index = 0;
        var self = this;
        var timer = setInterval(function() {
            self.onClickReseed("username");
            self.onClickReseed("password");
            index++;
            if (index > 10) {
                clearInterval(timer);
            }
        }, 100);

        event_.preventDefault();
    }

    render() {

        var self = this;

        const usernameStyles = {
            backgroundColor: this.state.username_color,
            padding: '0.5em',
            paddingBottom: '1em',
            border: '1px solid #CCC',
            borderRadius: '0.5em'
        };

        const passwordStyles = {
            backgroundColor: this.state.password_color,
            marginTop: '0.5em',
            marginBottom: '1em',
            padding: '0.5em',
            paddingBottom: '1em',
            border: '1px solid #CCC',
            borderRadius: '0.5em'
        };

        var index = 0;
        function makeKey() {
            return ("Login" + index++);
        }

        var usernameColors = [];
        for (var color of this.state.username_colors) {
            var x = { backgroundColor: color, color: color };
            usernameColors.push(<span style={x} key={makeKey()}>&bull;&bull;&bull;</span>);
        }

        var passwordColors = [];
        for (var color of this.state.password_colors) {
            var x = { backgroundColor: color, color: color };
            passwordColors.push(<span style={x} key={makeKey()}>&bull;&bull;&bull;</span>);
        }

        var colorDisplayPanelStyles = {
            backgroundColor: 'white',
            border: '1px solid #CCC',
            borderRadius: '0.5em',
            padding: '0.25em',
            marginLeft: '0.5em',
            marginRight: '0.5em'
        };

        return(<div>

               <HolisticIconPageHeader svg={this.props.document.metadata.page.icons.svg} title={this.props.document.metadata.site.name + " Login"}
               subtitle={"Please enter your user credentials below to log into " + this.props.document.metadata.site.name + "."} />

               <form onSubmit={this.onLoginFormSubmit}>
               <div style={usernameStyles}>
               <label>Username</label><br/>
               <input type="text" name="username" value={this.state.username} onChange={this.onTextInputChange}
               required autoFocus style={{ marginRight: '0.5em' }} />
               {' '}<span style={colorDisplayPanelStyles}>> {usernameColors} _</span>
               </div>

               <div style={passwordStyles}>
               <label>Password</label><br/>
               <input type="password" name="password" value={this.state.password} onChange={this.onTextInputChange}
               required style={{ marginRight: '0.5em' }} />
               {' '}<span style={colorDisplayPanelStyles}>> {passwordColors} _</span>
               </div>

               <input type="submit" value="Login"/>
               <span style={colorDisplayPanelStyles}>{usernameColors}{passwordColors}</span>
               <button onClick={this.onLoginFormClear}>Reset</button>
               </form>

               </div>
              );

    } // end render method

} // end class HolisticLogin

