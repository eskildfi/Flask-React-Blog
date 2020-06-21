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

    handleSubmit(event) {
        const data = new FormData(event.target);
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
            this.props.handleClick();
        }
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Title:
                    <textarea name="title" value={this.state.title} onChange={this.handleInputChange} />
                </label>
                <textarea name="content" value={this.state.content} onChange={this.handleInputChange} />
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

export default PostForm;