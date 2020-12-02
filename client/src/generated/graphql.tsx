import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A valid date time value */
  DateTime: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};


export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  totalPhotos: Scalars['Int'];
  allPhotos: Array<Photo>;
  orderedMembers: Array<Maybe<Scalars['String']>>;
  totalUsers: Scalars['Int'];
  allUsers: Array<User>;
};


export type QueryAllPhotosArgs = {
  after?: Maybe<Scalars['DateTime']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  postPhoto: Photo;
  githubAuth: AuthPayload;
  addFakeUsers: Array<User>;
  fakeUserAuth: AuthPayload;
};


export type MutationPostPhotoArgs = {
  input: PostPhotoInput;
};


export type MutationGithubAuthArgs = {
  code: Scalars['String'];
};


export type MutationAddFakeUsersArgs = {
  count?: Maybe<Scalars['Int']>;
};


export type MutationFakeUserAuthArgs = {
  githubLogin: Scalars['ID'];
};

export type Subscription = {
  __typename?: 'Subscription';
  newPhoto: Photo;
  newUser: User;
};

export type Photo = {
  __typename?: 'Photo';
  id: Scalars['ID'];
  url: Scalars['String'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  category: PhotoCategory;
  postedBy: User;
  taggedUsers: Array<User>;
  created: Scalars['DateTime'];
};

export type User = {
  __typename?: 'User';
  githubLogin: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  avatar?: Maybe<Scalars['String']>;
  postedPhotos: Array<Photo>;
  inPhotos: Array<Photo>;
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String'];
  user: User;
};

export type PostPhotoInput = {
  name: Scalars['String'];
  category?: Maybe<PhotoCategory>;
  description?: Maybe<Scalars['String']>;
  file: Scalars['Upload'];
};

export enum PhotoCategory {
  Selfie = 'SELFIE',
  Portrait = 'PORTRAIT',
  Action = 'ACTION',
  Landscape = 'LANDSCAPE',
  Graphic = 'GRAPHIC'
}

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}


export type AllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type AllUsersQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'totalUsers' | 'totalPhotos'>
  & { allUsers: Array<(
    { __typename?: 'User' }
    & UserInfoFragment
  )>, me?: Maybe<(
    { __typename?: 'User' }
    & UserInfoFragment
  )>, allPhotos: Array<(
    { __typename?: 'Photo' }
    & Pick<Photo, 'id' | 'name' | 'url'>
  )> }
);

export type UserInfoFragment = (
  { __typename?: 'User' }
  & Pick<User, 'githubLogin' | 'name' | 'avatar'>
);

export type ListenForUsersSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type ListenForUsersSubscription = (
  { __typename?: 'Subscription' }
  & { newUser: (
    { __typename?: 'User' }
    & Pick<User, 'githubLogin' | 'name' | 'avatar'>
  ) }
);

export type GithubAuthMutationVariables = Exact<{
  code: Scalars['String'];
}>;


export type GithubAuthMutation = (
  { __typename?: 'Mutation' }
  & { githubAuth: (
    { __typename?: 'AuthPayload' }
    & Pick<AuthPayload, 'token'>
  ) }
);

export type AllPhotosQueryVariables = Exact<{ [key: string]: never; }>;


export type AllPhotosQuery = (
  { __typename?: 'Query' }
  & { allPhotos: Array<(
    { __typename?: 'Photo' }
    & Pick<Photo, 'id' | 'url' | 'name'>
  )> }
);

export type AddFakeUsersMutationVariables = Exact<{
  count: Scalars['Int'];
}>;


export type AddFakeUsersMutation = (
  { __typename?: 'Mutation' }
  & { addFakeUsers: Array<(
    { __typename?: 'User' }
    & Pick<User, 'githubLogin' | 'name' | 'avatar'>
  )> }
);

export const UserInfoFragmentDoc = gql`
    fragment userInfo on User {
  githubLogin
  name
  avatar
}
    `;
export const AllUsersDocument = gql`
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
    ${UserInfoFragmentDoc}`;

/**
 * __useAllUsersQuery__
 *
 * To run a query within a React component, call `useAllUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllUsersQuery(baseOptions?: Apollo.QueryHookOptions<AllUsersQuery, AllUsersQueryVariables>) {
        return Apollo.useQuery<AllUsersQuery, AllUsersQueryVariables>(AllUsersDocument, baseOptions);
      }
export function useAllUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllUsersQuery, AllUsersQueryVariables>) {
          return Apollo.useLazyQuery<AllUsersQuery, AllUsersQueryVariables>(AllUsersDocument, baseOptions);
        }
export type AllUsersQueryHookResult = ReturnType<typeof useAllUsersQuery>;
export type AllUsersLazyQueryHookResult = ReturnType<typeof useAllUsersLazyQuery>;
export type AllUsersQueryResult = Apollo.QueryResult<AllUsersQuery, AllUsersQueryVariables>;
export const ListenForUsersDocument = gql`
    subscription listenForUsers {
  newUser {
    githubLogin
    name
    avatar
  }
}
    `;

/**
 * __useListenForUsersSubscription__
 *
 * To run a query within a React component, call `useListenForUsersSubscription` and pass it any options that fit your needs.
 * When your component renders, `useListenForUsersSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListenForUsersSubscription({
 *   variables: {
 *   },
 * });
 */
export function useListenForUsersSubscription(baseOptions?: Apollo.SubscriptionHookOptions<ListenForUsersSubscription, ListenForUsersSubscriptionVariables>) {
        return Apollo.useSubscription<ListenForUsersSubscription, ListenForUsersSubscriptionVariables>(ListenForUsersDocument, baseOptions);
      }
export type ListenForUsersSubscriptionHookResult = ReturnType<typeof useListenForUsersSubscription>;
export type ListenForUsersSubscriptionResult = Apollo.SubscriptionResult<ListenForUsersSubscription>;
export const GithubAuthDocument = gql`
    mutation githubAuth($code: String!) {
  githubAuth(code: $code) {
    token
  }
}
    `;
export type GithubAuthMutationFn = Apollo.MutationFunction<GithubAuthMutation, GithubAuthMutationVariables>;

/**
 * __useGithubAuthMutation__
 *
 * To run a mutation, you first call `useGithubAuthMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGithubAuthMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [githubAuthMutation, { data, loading, error }] = useGithubAuthMutation({
 *   variables: {
 *      code: // value for 'code'
 *   },
 * });
 */
export function useGithubAuthMutation(baseOptions?: Apollo.MutationHookOptions<GithubAuthMutation, GithubAuthMutationVariables>) {
        return Apollo.useMutation<GithubAuthMutation, GithubAuthMutationVariables>(GithubAuthDocument, baseOptions);
      }
export type GithubAuthMutationHookResult = ReturnType<typeof useGithubAuthMutation>;
export type GithubAuthMutationResult = Apollo.MutationResult<GithubAuthMutation>;
export type GithubAuthMutationOptions = Apollo.BaseMutationOptions<GithubAuthMutation, GithubAuthMutationVariables>;
export const AllPhotosDocument = gql`
    query allPhotos {
  allPhotos {
    id
    url
    name
  }
}
    `;

/**
 * __useAllPhotosQuery__
 *
 * To run a query within a React component, call `useAllPhotosQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllPhotosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllPhotosQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllPhotosQuery(baseOptions?: Apollo.QueryHookOptions<AllPhotosQuery, AllPhotosQueryVariables>) {
        return Apollo.useQuery<AllPhotosQuery, AllPhotosQueryVariables>(AllPhotosDocument, baseOptions);
      }
export function useAllPhotosLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllPhotosQuery, AllPhotosQueryVariables>) {
          return Apollo.useLazyQuery<AllPhotosQuery, AllPhotosQueryVariables>(AllPhotosDocument, baseOptions);
        }
export type AllPhotosQueryHookResult = ReturnType<typeof useAllPhotosQuery>;
export type AllPhotosLazyQueryHookResult = ReturnType<typeof useAllPhotosLazyQuery>;
export type AllPhotosQueryResult = Apollo.QueryResult<AllPhotosQuery, AllPhotosQueryVariables>;
export const AddFakeUsersDocument = gql`
    mutation addFakeUsers($count: Int!) {
  addFakeUsers(count: $count) {
    githubLogin
    name
    avatar
  }
}
    `;
export type AddFakeUsersMutationFn = Apollo.MutationFunction<AddFakeUsersMutation, AddFakeUsersMutationVariables>;

/**
 * __useAddFakeUsersMutation__
 *
 * To run a mutation, you first call `useAddFakeUsersMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddFakeUsersMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addFakeUsersMutation, { data, loading, error }] = useAddFakeUsersMutation({
 *   variables: {
 *      count: // value for 'count'
 *   },
 * });
 */
export function useAddFakeUsersMutation(baseOptions?: Apollo.MutationHookOptions<AddFakeUsersMutation, AddFakeUsersMutationVariables>) {
        return Apollo.useMutation<AddFakeUsersMutation, AddFakeUsersMutationVariables>(AddFakeUsersDocument, baseOptions);
      }
export type AddFakeUsersMutationHookResult = ReturnType<typeof useAddFakeUsersMutation>;
export type AddFakeUsersMutationResult = Apollo.MutationResult<AddFakeUsersMutation>;
export type AddFakeUsersMutationOptions = Apollo.BaseMutationOptions<AddFakeUsersMutation, AddFakeUsersMutationVariables>;