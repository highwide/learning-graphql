import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useApolloClient, useMutation, gql } from "@apollo/client"
import { ROOT_QUERY } from "./App";
import { Me } from "./Me";
import { AllUsersQuery, GithubAuthMutation } from "./generated/graphql";

const GITHUB_AUTH_MUTATION = gql`
  mutation githubAuth($code: String!) {
    githubAuth(code: $code) {
      token
    }
  }
`;

const AuthorizedUser: React.FC = () => {
  const history = useHistory();
  const client = useApolloClient();
  const [signingIn, setSigningIn] = useState(false);

  const [githubAuthMutation] = useMutation<GithubAuthMutation>(GITHUB_AUTH_MUTATION, {
    update(cache, { data }) { authorizationComplete(cache, data) },
    refetchQueries: [{ query: ROOT_QUERY }],
  })

  const authorizationComplete = (_cache, data) => {
    if (data) {
      localStorage.setItem("token", data.githubAuth.token);
      history.replace("/");
      setSigningIn(false);
    }
  };

  const requestCode = () => {
    const clientId = process.env["REACT_APP_GITHUB_CLIENT_ID"]
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user`;
  }

  useEffect(() => {
    if (window.location.search.match(/code=/)) {
      setSigningIn(true);
      const code = window.location.search.replace("?code=", "");
      githubAuthMutation({ variables: { code } });
    }
  }, [githubAuthMutation])

  return (
    <Me
      signingIn={signingIn}
      requestCode={requestCode}
      logout={() => {
        localStorage.removeItem("token");
        const data = client.readQuery<AllUsersQuery>({ query: ROOT_QUERY });
        if (data) {
          const writeData = Object.assign({}, data)
          writeData.me = null
          client.writeQuery<AllUsersQuery>({ query: ROOT_QUERY, data: writeData });
        }
      }}
    />
  );
}

export default AuthorizedUser;
