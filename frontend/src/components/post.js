import React from 'react';
import PostForm from './postform';
import {useParams} from 'react-router-dom';

class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            showForm: false,
            title: null,
            content: null
        };
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        let id = this.props.match.params.id;
        fetch(`http://localhost:5000/posts/${id}`)
        .then(res => res.json())
        .then(data => this.setState({title: data.title, content: data.content}));
    }

    handleClick() {
        this.setState({showForm: !this.state.showForm});
    }

    render() {
        if (!this.state.title) {
            return <p></p>;
        }

        if (this.state.showForm) {
            return(
            <PostForm id={this.props.match.params.id} title={this.state.title} content={this.state.content} handleClick={this.handleClick}/>
            );
        }
        return (
            <div className="post">
                <div className="title">
                    <p>{this.state.title}</p>
                </div>
                <div className="content">
                    <p>{this.state.content}</p>
                </div>
                <button onClick={this.handleClick}>Edit</button>
            </div>
        );
    }
}

export default Post;