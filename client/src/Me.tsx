import React from "react";
import { Query } from '@apollo/client/react/components';
import { ROOT_QUERY } from "./App";
import { AllUsersQuery } from "./generated/graphql";

type MeProps = {
  logout: () => void,
  requestCode: () => void,
  signingIn: boolean,
}

export const Me: React.FC<MeProps> = ({ logout, requestCode, signingIn }) => (
  <Query<AllUsersQuery> query={ROOT_QUERY}>
    {({ loading, data }) =>
      data?.me ? (
        <CurrentUser
          name={data.me.name || ''}
          avatar={data.me.avatar || ''}
          logout={logout} />
      ) : loading ? (
        <p>loading...</p>
      ) : (
        <button onClick={requestCode} disabled={signingIn}>
          Sign In with Github
        </button>
      )
    }
  </Query>
);

type CurrentUserProps = {
  name: string;
  avatar: string;
  logout: () => void;
}

const CurrentUser: React.FC<CurrentUserProps> = ({ name, avatar, logout }) => (
  <div>
    <img src={avatar} width={48} height={48} alt="" />
    <h1>{name}</h1>
    <button onClick={logout}>logout</button>
  </div>
);
