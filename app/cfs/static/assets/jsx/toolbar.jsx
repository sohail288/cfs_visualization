var React = require('react');


var ActionButton = React.createClass({

    render: function () {
        //console.log(this.props);
        return (
            <button onClick={this.props.action}
                    className="btn btn-default">
                    {this.props.text}
                    </button>
        )
    }
});


var ChoiceMenu = React.createClass({
    // choices are passed as an array of strings
    // upon update, the handler is called to change the state in the app

    getInitialState: function() {
        return {
            selected: null,
        };

    },

    handleChange: function(event) {
        var t = event.target.text;
        this.setState({selected: t});

        this.props.action(t);
    },

    render: function() {
        var menuItems = this.props.choices.map(function(d,i) {
            return (
                <li><a href="#">{d}</a></li>
            )
        });

        return (
            <div className="btn-group" role="group">
                <button type="button" className="btn btn-default dropdown-toggle"
                        data-toggle="dropdown" aria-haspopup="true"
                        aria-expanded="false">
                        {this.props.text} 
                        <span className="caret"></span>
                </button>
                <ul onClick={this.handleChange} className="dropdown-menu">
                    {menuItems}
                </ul>
            </div>
        )
    }

});


module.exports = React.createClass({

    render: function () {
        console.log("rendering toolbar");
        return (
            <div className="col-md-12 btn-group">
                <ActionButton text="Clear Selections" 
                              action={this.props.handleClear} />
                <ChoiceMenu   choices={this.props.chloroOptions}
                              text="Chloropeth Type" 
                              action={this.props.handleChloropethSelect}/>
            </div>
        )
    }
});
