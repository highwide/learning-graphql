import React from 'react'
import Users from './Users'
import { BrowserRouter } from "react-router-dom"
import { gql } from 'apollo-boost'
import AuthorizedUser from './AuthroziedUser'

export const ROOT_QUERY = gql`
query allUsers {
  totalUsers
  allUsers {
    githubLogin
    name
    avatar
  }
}

fragment userInfo on User {
  githubLogin
  name
  avatar
}
`

const App = () =>
<BrowserRouter>
    <div>
        <AuthorizedUser />
        <Users />
    </div>
</BrowserRouter>

export default App