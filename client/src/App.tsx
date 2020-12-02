import React, { useEffect } from "react";
import Users from "./Users";
import { BrowserRouter } from "react-router-dom";
import { useApolloClient, useSubscription, gql } from "@apollo/client";
import AuthorizedUser from "./AuthorizedUser";
import { AllUsersQuery, ListenForUsersSubscription } from "./generated/graphql";

export const ROOT_QUERY = gql`
  query allUsers {
    totalUsers
    totalPhotos
    allUsers {
      ...userInfo
    }
    me {
      ...userInfo
    }
    allPhotos {
      id
      name
      url
    }
  }

  fragment userInfo on User {
    githubLogin
    name
    avatar
  }
`;

const LISTEN_FOR_USERS = gql`
  subscription listenForUsers {
    newUser {
      githubLogin
      name
      avatar
    }
  }
`

const App: React.FC = () => {
  const { data } = useSubscription<ListenForUsersSubscription>(LISTEN_FOR_USERS);
  const client = useApolloClient();

  useEffect(() => {
    const readData = client.readQuery<AllUsersQuery>({ query: ROOT_QUERY })
    if (readData && data) {
      const writeData = Object.assign({}, readData)
      writeData.totalUsers += 1
      writeData.allUsers = [
        ...writeData.allUsers,
        data.newUser
      ]
      client.writeQuery<AllUsersQuery>({ query: ROOT_QUERY, data: writeData })
    }
  })

  return (
    <BrowserRouter>
      <div>
        <AuthorizedUser />
        <Users />
      </div>
    </BrowserRouter>
  )
}

export default App;
