import React from 'react';
import {Link} from 'react-router-dom';
import PostForm from './postform';
import "../css/titlelist.css";

class TitleList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {titles: []};
    }

    componentDidMount() {
        fetch("http://localhost:5000/")
          .then(res => res.json())
          .then(res => this.setState({titles: res}));
    }

    render() {
       const titleList = this.state.titles.map((title) => 
        <li className="titlelist" key={title[0]}><Link className="titlelist" to={`/posts/${title[0]}`}>{title[1]}</Link></li>
       );

       return (
           <div id="titlelist">
           <PostForm isCreateForm="true" />
           <ul>{titleList}</ul>
           </div>
       );
    }
}

export default TitleList;