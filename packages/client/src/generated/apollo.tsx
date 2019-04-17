export type Maybe<T> = T | null;

export interface SignupUserInput {
  password: string;

  username: string;

  email: string;
}

// ====================================================
// Documents
// ====================================================

export type LoginVariables = {
  username: string;
  password: string;
};

export type LoginMutation = {
  __typename?: 'Mutation';

  login: Maybe<LoginLogin>;
};

export type LoginLogin = {
  __typename?: 'User';

  id: string;

  username: string;

  email: string;
};

export type GetUsersVariables = {};

export type GetUsersQuery = {
  __typename?: 'Query';

  users: Maybe<GetUsersUsers[]>;
};

export type GetUsersUsers = {
  __typename?: 'User';

  id: string;

  username: string;
};

import * as ReactApollo from 'react-apollo';
import * as React from 'react';

import gql from 'graphql-tag';

// ====================================================
// Components
// ====================================================

export const LoginDocument = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
      email
    }
  }
`;
export class LoginComponent extends React.Component<
  Partial<ReactApollo.MutationProps<LoginMutation, LoginVariables>>
> {
  render() {
    return (
      <ReactApollo.Mutation<LoginMutation, LoginVariables>
        mutation={LoginDocument}
        {...(this as any)['props'] as any}
      />
    );
  }
}
export type LoginProps<TChildProps = any> = Partial<
  ReactApollo.MutateProps<LoginMutation, LoginVariables>
> &
  TChildProps;
export type LoginMutationFn = ReactApollo.MutationFn<
  LoginMutation,
  LoginVariables
>;
export function LoginHOC<TProps, TChildProps = any>(
  operationOptions:
    | ReactApollo.OperationOption<
        TProps,
        LoginMutation,
        LoginVariables,
        LoginProps<TChildProps>
      >
    | undefined,
) {
  return ReactApollo.graphql<
    TProps,
    LoginMutation,
    LoginVariables,
    LoginProps<TChildProps>
  >(LoginDocument, operationOptions);
}
export const GetUsersDocument = gql`
  query getUsers {
    users {
      id
      username
    }
  }
`;
export class GetUsersComponent extends React.Component<
  Partial<ReactApollo.QueryProps<GetUsersQuery, GetUsersVariables>>
> {
  render() {
    return (
      <ReactApollo.Query<GetUsersQuery, GetUsersVariables>
        query={GetUsersDocument}
        {...(this as any)['props'] as any}
      />
    );
  }
}
export type GetUsersProps<TChildProps = any> = Partial<
  ReactApollo.DataProps<GetUsersQuery, GetUsersVariables>
> &
  TChildProps;
export function GetUsersHOC<TProps, TChildProps = any>(
  operationOptions:
    | ReactApollo.OperationOption<
        TProps,
        GetUsersQuery,
        GetUsersVariables,
        GetUsersProps<TChildProps>
      >
    | undefined,
) {
  return ReactApollo.graphql<
    TProps,
    GetUsersQuery,
    GetUsersVariables,
    GetUsersProps<TChildProps>
  >(GetUsersDocument, operationOptions);
}
