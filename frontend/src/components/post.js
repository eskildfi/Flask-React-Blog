import React from 'react';
import PostForm from './postform';
import ReactMarkdown from 'react-markdown';
import {withRouter} from 'react-router-dom';
import "../css/post.css";


class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            showForm: false,
            user: null,
            title: null,
            content: null
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        let id = this.props.match.params.id;
        fetch(`/api/posts/${id}`)
        .then(res => res.json())
        .then(data => this.setState({user: data.user_name, title: data.title, content: data.content}));
    }

    handleClick(title, content) {
        this.setState({showForm: !this.state.showForm});
        if (title && content) {
            this.setState(
                {
                    title: title,
                    content: content
                }
            );
        }
    }

    handleDelete() {
        const id = this.props.match.params.id;
        const options = {
            method: "POST",
            headers: new Headers({
                "Authorization": localStorage.getItem("token"),
            })
        }
        fetch(`/api/delete/${id}`, options)
        .then(res => {
            if (res.ok) {
                this.props.history.goBack();
            }
        });
    }

    render() {
        //if (!this.state.title) {
            //return <p></p>;
        //}

        if (this.state.showForm) {
            console.log(this.state);
            return(
            <PostForm id={this.props.match.params.id} title={this.state.title} content={this.state.content} handleClick={this.handleClick}/>
            );
        }

        var postOpts = null;
        if (this.props.username && (this.props.username === this.state.user)) {
            postOpts = <div className="post-options">
                            <button className="button" onClick={this.handleClick}>Edit</button>
                            <button className="button" onClick={this.handleDelete}>Delete</button>
                        </div>
        }

        return (
            <div>
                {postOpts}
                <div className="post">
                    <div className="title">
                        <h1>{this.state.title}</h1>
                    </div>
                    <p style={{fontSize:"0.9em"}}><em>Author: {this.state.user}</em></p>

                    <div className="content">
                        <ReactMarkdown source={this.state.content}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Post);