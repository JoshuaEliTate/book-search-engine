import { gql } from '@apollo/client';

export const GET_ME = gql`
query Me  {
    me {
      id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }`;
