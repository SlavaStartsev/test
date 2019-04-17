import { gql } from 'apollo-boost';

export const usersQuery = gql`
  query getUsers {
    users {
      id
      username
    }
  }
`;
