import React, { useEffect, useState } from 'react';
import Post from './components/post';
import TitleList from './components/titlelist';
import Login from './components/login';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  Link
} from 'react-router-dom';
//import ReactMarkdown from 'react-markdown';
import './App.css';

function App() {
  var userName = null;
  const token = localStorage.getItem("token");
  if (token) {
    var tokenSplit = token.split(".");
    var tokenBody = JSON.parse(atob(tokenSplit[1]));
    userName = <p>{tokenBody['sub']}</p>
  }

  return (
    <Router>
      <div id="head-links">
        <Link to={'/'}>Home</Link>
        <Link to={"/login"}>Login</Link>
        <button className="button" onClick={localStorage.clear()}>Sign Out</button>
      </div>
      {userName}
      <Switch>
        <Route path="/posts/:id" component={Post} />
        <Route path="/login" component={Login} />
        <Route path="/"><TitleList /></Route>
      </Switch>
    </Router>
  );
}


export default App;
