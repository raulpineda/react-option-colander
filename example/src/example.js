var React = require('react');
var ReactDOM = require('react-dom');
var OptionColander = require('react-option-colander');

var App = React.createClass({
	render () {
		return (
			<div>
				<OptionColander />
			</div>
		);
	}
});

ReactDOM.render(<App />, document.getElementById('app'));
