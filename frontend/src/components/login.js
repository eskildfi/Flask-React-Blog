import React from 'react';
import {withRouter} from 'react-router-dom';
import "../css/login.css";

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = 
            {
                loginFailed: false,
                registerFailed: false,
                username: "",
                password: ""
            };
        
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.testAuth = this.testAuth.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
    }

    handleInputChange(event) {
        this.setState(
            {
                [event.target.name]: event.target.value
            });
    }

    handleLogin() {
        const data = new FormData();
        data.append("username", this.state.username);
        data.append("password", this.state.password);
        const options = {
            method: "POST",
            body: data
        }
        fetch("/api/login", options)
        .then(res => { 
            if (!res.ok) {
                this.setState({loginFailed: true});
                return false
            } 
            return res.json()})
        .then(data => {
            if (data) {
                console.log(data);
                localStorage.setItem("token", data.token);
                this.props.updateUsername();
                this.props.history.push("/");
            }
        });
    }

    handleRegister() {
        const data = new FormData();
        data.append("username", this.state.username);
        data.append("password", this.state.password);
        const options = {
            method: "POST",
            body: data
        }
        fetch("/api/register", options)
        .then(res => {
            if (!res.ok) {
                this.setState({registerFailed: true});
            }
            else {
                this.handleLogin();
            }
        });
    }

    testAuth() {
        const options = {
            method: "POST",
            body: localStorage.getItem("token"),
            headers: new Headers({
                "Authorization": localStorage.getItem("token"),
            })
        }
        fetch("/api/auth", options)
        .then(res => console.log(res.ok));
    }

    render() {

        var loginFailedText = null
        if (this.state.loginFailed) {
            loginFailedText = <p className="errormsg">Login failed</p>
        }

        var registerFailedText = null
        if (this.state.registerFailed) {
            registerFailedText = <p className="errormsg">User already exists</p>
        }

        return (
            <div>
                {loginFailedText}
                {registerFailedText}
                <form>
                    <ul>
                        <li>
                            <label>Username:</label>
                            <input type="text" value={this.state.username} name="username" onChange={this.handleInputChange} />
                        </li>
                        <li>
                            <label>Password:</label>  
                            <input type="password" value={this.state.password} className="password" name="password" onChange={this.handleInputChange} />
                        </li>
                    </ul>
                </form>
                <button onClick={this.handleLogin}>Login</button>
                <button onClick={this.handleRegister}>Register</button>
            </div>
        )
    }
}

export default withRouter(Login);