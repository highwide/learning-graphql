import React from 'react'
import { Query } from 'react-apollo'
import { ROOT_QUERY } from './App'

const Users = () =>
<Query query={ROOT_QUERY}>
  {result =>
  <p>Users are loading: {result.loading ? "yes" : "no"}</p>
  }
</Query>

export default Users