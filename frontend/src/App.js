import React, { useEffect, useState } from 'react';
import Post from './components/post';
import TitleList from './components/titlelist';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  Link
} from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
//import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/posts/:id" component={Post} />
        <Route path="/"><TitleList /></Route>
      </Switch>
    </Router>
  );
}


export default App;
