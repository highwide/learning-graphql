import React, { Fragment, useEffect } from "react";
import Users from "./Users";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useApolloClient, useSubscription, gql } from "@apollo/client";
import AuthorizedUser from "./AuthorizedUser";
import { AllUsersQuery, ListenForUsersSubscription } from "./generated/graphql";
import Photos from "./Photos";
import { PostPhoto } from "./PostPhoto";

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
      <Switch>
        <Route exact path="/" component={
          () => <>
            <AuthorizedUser />
            <Users />
            <Photos />
          </>
        } />
        <Route path="/newPhoto" component={PostPhoto} />
        <Route component={({ location }) => <h1>"{location.pathname}" not found</h1>} />
      </Switch>
    </BrowserRouter>
  )
}

export default App;
