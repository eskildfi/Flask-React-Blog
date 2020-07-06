import React from 'react';
import {Link} from 'react-router-dom';
import PostForm from './postform';
import "../css/titlelist.css";

class TitleList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {titles: []};
        this.addTitle = this.addTitle.bind(this);
    }

    componentDidMount() {
        fetch("http://localhost:5000/")
          .then(res => res.json())
          .then(res => this.setState({titles: res}));
    }
    
    addTitle(title) {
        var t = this.state.titles.slice();
        t.unshift([t.length+1, title]);
        this.setState({titles: t})
    }

    render() {
       const titleList = this.state.titles.map((title) => 
        <li className="titlelist" key={title[0]}><Link className="titlelist" to={`/posts/${title[0]}`}>{title[1]}</Link></li>
       );

       return (
           <div id="titlelist">
           <PostForm isCreateForm="true" addTitle={this.addTitle}/>
           <ul>{titleList}</ul>
           </div>
       );
    }
}

export default TitleList;