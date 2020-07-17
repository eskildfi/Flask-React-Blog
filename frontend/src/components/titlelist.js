import React from 'react';
import {Link} from 'react-router-dom';
import PostForm from './postform';
import "../css/titlelist.css";

class TitleList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            titles: []
        };
        this.addTitle = this.addTitle.bind(this);
    }

    componentDidMount() {
        //const options = {
            //method: "POST",
            //headers: new Headers({
                //"Authorization": localStorage.getItem("token")
            //})
        //}
        //fetch("/api/auth", options)
        //.then(res => {
            //if (res.ok) {
                //this.setState({loggedIn: true});
            //}
        //});
        if (this.props.user) {
            fetch(`/api/user/${this.props.user}`)
                .then(res => res.json())
                .then(res => this.setState({titles: res}));
        }
        else {
            fetch("/api")
            .then(res => res.json())
            .then(res => this.setState({titles: res}));
        }
    }
    
    addTitle(title) {
        fetch("/api")
          .then(res => res.json())
          .then(res => this.setState({titles: res}));
    }

    render() {
       const titleList = this.state.titles.map((title) => 
        <li className="titlelist" key={title[1]}>
            <Link className="titlelist" to={`/posts/${title[1]}`}>{title[2]}</Link>
            <Link className="profile-link" to={`/user/${title[0]}`}>{title[0]}</Link>
        </li>
       );

       var postForm = null;
       if (this.props.username) {
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