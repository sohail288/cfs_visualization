/** @jsx React.DOM */

var React = require('react');
var ReactDOM = require('react-dom');

var App = require('./app.jsx');


ReactDOM.render(
    <div>
        <h1> CFS APP </h1>
        <App get_data_url='/states/'
             get_breakdown_endpoint='break_down'
             get_info_endpoint='/info/'/>
    </div>,
    document.getElementById('react-main')
);
