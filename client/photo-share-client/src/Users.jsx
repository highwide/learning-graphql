import React from 'react'
import {Query, Mutation} from 'react-apollo'
import {gql} from 'apollo-boost'
import {ROOT_QUERY} from './App'

const ADD_FAKE_USERS_MUTATION = gql`
 mutation addFakeUsers($count:Int!) {
    addFakeUsers(count: $count) {
        githubLogin
        name
        avatar
    }
 }
`

const updateUserCache = (cache, { data:{ addFakeUsers } }) => {
    let data = cache.readQuery({ query: ROOT_QUERY })
    data.totalUsers += addFakeUsers.length
    data.allUsers = [
    ...data.allUsers,
    ...addFakeUsers
    ]
    cache.writeQuery({ query: ROOT_QUERY, data })
}

const Users = () =>
    <Query query={ROOT_QUERY} fetchPolicy="cache-and-network">
        {({data, loading, refetch}) => loading ?
            <p>loading users...</p> :
            <UserList
                count={data.totalUsers}
                users={data.allUsers}
                refetchUsers={refetch} />
        }
    </Query>

const UserList = ({count, users, refetchUsers}) =>
    <div>
        <p>{count} Users</p>
        <button onClick={() => refetchUsers()}>Refetch Users</button>
        <Mutation mutation={ADD_FAKE_USERS_MUTATION}
                // XXX: For some reason cache changes don't trigger re-rendering
                //   update={updateUserCache}
                  variables={{ count: 1}}
                  refetchQueries={[{ query: ROOT_QUERY}]}
        >
            {addFakeUsers =>
                <button onClick={addFakeUsers}>Add Fake Users</button>
            }
        </Mutation>
        <ul>
            {users.map(user =>
                <UserListItem key={user.githubLogin}
                              name={user.name}
                              avatar={user.avatar}/>
            )}
        </ul>
    </div>

const UserListItem = ({name, avatar}) =>
    <li>
        <img src={avatar} width={48} height={48} alt=""/>
        {name}
    </li>
export default Users
