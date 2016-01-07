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


module.exports = React.createClass({

    render: function () {
        console.log("rendering toolbar");
        return (
            <div className="col-md-12">
                <ActionButton text="Clear Selections" 
                              action={this.props.handleClear} />
                <ActionButton text="A button" />
                <ActionButton text="A button" />
                <ActionButton text="A button" />
                <ActionButton text="A button" />
                <ActionButton text="A button" />
            </div>
        )
    }
});
