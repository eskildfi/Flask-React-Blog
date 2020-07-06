import React from 'react';
import '../css/postform.css';

class PostForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {title: props.title, content: props.content};

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit() {
        const data = new FormData();
        data.append("title", this.state.title);
        data.append("content", this.state.content);
        const options = {
            method: "POST",
            body: data, 
        }
        if (this.props.isCreateForm) {
            // Form is being used to create new posts
            fetch(`http://localhost:5000/post-article`, options);
        }
        else {
            // Post is being used to update old posts. Part of the /posts/ pages
            //event.preventDefault();
            fetch(`http://localhost:5000/update/${this.props.id}`, options);
            this.props.handleClick(this.state.title, this.state.content);
        }
    }

    render() {
        return (
            <div className="post">
                <form onSubmit={this.handleSubmit}>
                    <ul>
                        <li>
                            <label>
                                Title:
                            </label>
                            <textarea className="title" name="title" value={this.state.title} onChange={this.handleInputChange} />
                        </li>
                        <li>
                            <label>
                                Content:
                            </label>
                            <textarea className="content" name="content" value={this.state.content} onChange={this.handleInputChange} />
                        </li>
                    </ul>
                </form>
                <button className="button" onClick={this.handleSubmit}>Submit</button>
            </div>
        );
    }
}

export default PostForm;