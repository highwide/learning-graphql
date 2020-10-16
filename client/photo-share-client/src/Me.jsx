import React from 'react'
import { Query } from 'react-apollo'
import { ROOT_QUERY } from './App'

export const Me = ({ logout, requestCode, signingIn }) =>
<Query query={ROOT_QUERY}>
    {({ loading, data }) => data?.me ?
        <CurrentUser {...data.me} logout={logout} /> :
        loading ?
            <p>loading...</p> :
            <button 
                onClick={requestCode}
                disabled={signingIn}>
                    Sign In with Github
            </button> 
    } 
</Query>

const CurrentUser = ({ name, avatar, logout }) =>
<div>
    <img src={avatar} width={48} height={48} alt="" />
    <h1>{name}</h1>
    <button onClick={logout}>logout</button>
</div>
