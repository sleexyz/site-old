import React from "react";

const App = React.createClass({
    render() {
        console.log("App rendered!");
        return (
            <div id="App">
                {this.props.children}
            </div>
        )
    }
});

export default App;
