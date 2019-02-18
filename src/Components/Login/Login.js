import React, { Component } from 'react';
import './../../App.css';
import './../../css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
import DeveloperDashBoard from "../Dashboards/DeveloperDashBoard";
import {reactLocalStorage} from 'reactjs-localstorage';
import InitConfigurations from "../InitConfigurations";
import axios from 'axios'
import Notify from 'notifyjs';
import Loading from "../ShowMessage";
import SectionsManager from "../SectionsManager";
import {configGetHost} from "../../Helpers/LocalConfig";
const config = reactLocalStorage.getObject('config');
var myNotification = new Notify('Yo dawg!', {
    body: 'This is an awesome notification',
    //notifyShow: onNotifyShow
});

// ...
const electron = window.require('electron');
const chokidar = electron.remote.require('chokidar');

var watcher = chokidar.watch('./tmp', {ignored: /^\./, persistent: true});

// watcher
//     .on('add', function(path) {console.log('File', path, 'has been added');})
//     .on('change', function(path) {console.log('File', path, 'has been changed');})
//     .on('unlink', function(path) {console.log('File', path, 'has been removed');})
//     .on('error', function(error) {console.error('Error happened', error);});

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            parent: null,
        }
    };

    // ...
    prepareLoginResponse(response) {

        if (response.data.cod == '00') {

            this.setState({
                loading: false
            });

            reactLocalStorage.setObject("user.data",response.data);

            console.log(response.data);

            this.props.parent.loadSection('dashboard_dev');
            this.props.parent.setUser(response.data.info);

        } else {
            alert("Error de login!");
        }
    }

    // Send Request Login.
    logUser = (event) => {
        event.preventDefault();
        const user = event.target.username.value;
        const pass = event.target.username.value;
        this.setState({ loading:true });
        axios.get(configGetHost()+'/api/station/login?user='+user+'&pass='+pass)
            .then(response => this.prepareLoginResponse(response))
    };

    render() {

        // Verify Init-Configurations:
        if(! config.host) {
            return (
                <div className="App">
                    <InitConfigurations />
                </div>
            );

        }else {

            return (
                // Go to Login
                <div className="App App-login">
                    <h2>Login</h2>
                    <form onSubmit={this.logUser}>
                        <div className="form-group">
                            <label htmlFor="exampleDropdownFormEmail1">Username</label>
                            <input
                                type="text"
                                name="username"
                                className="form-control"
                                placeholder="email@example.com" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleDropdownFormPassword1">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                placeholder="Password" />
                        </div>
                        <div className="form-check">
                            <input type="checkbox" className="form-check-input" id="dropdownCheck"/>
                                <label className="form-check-label" htmlFor="dropdownCheck">
                                    Recuerdame
                                </label>
                        </div>
                        <button className="btn btn-primary">Iniciar</button>
                        {this.state.loading ? <Loading /> : ""}
                    </form>
                    <div className="dropdown-divider"> </div>
                    <a className="dropdown-item" href="#">New around here? Sign up</a>
                    <a className="dropdown-item" href="#">Forgot password?</a>
                </div>
            );
        }
    }
}

export default Login;
