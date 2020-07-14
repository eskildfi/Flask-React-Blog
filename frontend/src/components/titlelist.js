import React from 'react';
import {Link} from 'react-router-dom';
import PostForm from './postform';
import "../css/titlelist.css";

class TitleList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            titles: []
        };
        this.addTitle = this.addTitle.bind(this);
    }

    componentDidMount() {
        const options = {
            method: "POST",
            headers: new Headers({
                "Authorization": localStorage.getItem("token")
            })
        }
        fetch("/api/auth", options)
        .then(res => {
            if (res.ok) {
                this.setState({loggedIn: true});
            }
        });

        fetch("/api")
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

       var postForm = null;
       if (this.state.loggedIn) {
           postForm = <PostForm isCreateForm="true" addTitle={this.addTitle}/>
       }

       return (
           <div id="titlelist">
               {postForm}
                <ul>{titleList}</ul>
           </div>
       );
    }
}

export default TitleList;