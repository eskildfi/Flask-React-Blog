import React from 'react';
import Post from './post';
import TitleList from './titlelist';
import Login from './login';
import User from './user';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

class Header extends React.Component {
    constructor(props) {
        super(props);
        var userName = null;
        this.state = {
            username: userName
        };
        this.updateUsername = this.updateUsername.bind(this);
        this.signOut = this.signOut.bind(this);

    }

    componentDidMount() {
        this.updateUsername();
    }

    updateUsername() {
        const token = localStorage.getItem("token");
        if (token) {
            var tokenSplit = token.split(".");
            var tokenBody = JSON.parse(atob(tokenSplit[1]));
            this.setState({username: tokenBody['sub']});
        }
    }

    signOut() {
        localStorage.clear();
        this.setState({username: null});
    }

    render() {
        var userName = null;
        if (this.state.username) {
           userName = <Link className="profile-link" to={`/user/${this.state.username}`}>{this.state.username}</Link>
        }

        const loginComp = () => <Login updateUsername={this.updateUsername}/>
        const postComp = () => <Post username={this.state.username}/>

        var signInOut = <Link to={"/login"}>Sign in</Link>
        if (this.state.username) {
            signInOut = <button onClick={this.signOut}>Sign Out</button>
        }

        return (
            <Router>
                <div id="head-links">
                    <Link to={'/'}>Home</Link>
                    {signInOut}
                    {userName}
                </div>
                <Switch>
                    <Route path="/posts/:id" component={postComp} />
                    <Route path="/user/:userName" component={(props) => <User {...props} />} />
                    <Route path="/login" component={loginComp}/>
                    <Route exact path="/"><TitleList username={this.state.username}/></Route>
                </Switch>
            </Router>

        )
    }
}

export default Header;