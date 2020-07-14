import React from 'react';
import TitleList from './titlelist';

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
            loginFailedText = <p>Login failed</p>
        }

        var registerFailedText = null
        if (this.state.registerFailed) {
            registerFailedText = <p>Username already in use</p>
        }

        return (
            <div>
                {loginFailedText}
                {registerFailedText}
                <form>
                    <label>Username:</label>
                    <textarea value={this.state.username} name="username" onChange={this.handleInputChange} />
                    <label>Password:</label>  
                    <textarea value={this.state.password} name="password" onChange={this.handleInputChange} />
                </form>
                <button className="button" onClick={this.handleLogin}>Login</button>
                <button className="button" onClick={this.testAuth}>Auth</button>
                <button className="button" onClick={this.handleRegister}>Register</button>
            </div>
        )
    }
}

export default Login;