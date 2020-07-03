import React from 'react';
import PostForm from './postform';
import ReactMarkdown from 'react-markdown';


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

    render() {
        if (!this.state.title) {
            return <p></p>;
        }

        if (this.state.showForm) {
            console.log(this.state);
            return(
            <PostForm id={this.props.match.params.id} title={this.state.title} content={this.state.content} handleClick={this.handleClick}/>
            );
        }
        return (
            <div className="post">
                <div className="title">
                    <h1>{this.state.title}</h1>
                </div>
                <div className="content">
                    <ReactMarkdown source={this.state.content}/>
                </div>
                <button onClick={this.handleClick}>Edit</button>
            </div>
        );
    }
}

export default Post;