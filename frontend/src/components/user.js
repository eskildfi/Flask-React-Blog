import React from 'react';
import TitleList from './titlelist';

function User(props) {

    const user = props.match.params.userName;
    const userPage = <div className="userPage">
                        <h2 style={{textAlign:"center"}}>{user}</h2>
                        <TitleList user={user}/>
                     </div>
    return userPage;
}

export default User;