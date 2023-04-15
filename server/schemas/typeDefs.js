// const { gql } = require('apollo-server-express');

// const typeDefs = gql`

// type User{
//     _id:ID
//     username: String!
//     email: String!
//     password: String!
//     savedBooks: [Book]
// }
// type Book{
//     authors: [String]
//     description: String!
//     bookId: String!
//     image: String
//     link: String
//     title: String!
// }
// type Auth {
//   token: ID
//   user: User
// }

// type Query {
//     me: User
//   }

//   type Mutation {
//     deleteBook(bookId: ID!): User
//     saveBook(
//       author: [String]
//       description: String
//       title: String
//       bookId: String
//       image: String
//       link: String
//     ): User
//     addUser(username: String!, email: String!, password: String!): Auth
//     login(email: String!, password: String!): Auth
//   }
// `

// module.exports = typeDefs;

const { gql } = require("apollo-server-express");

const typeDefs = gql`
  input BookInput {
    bookId: ID!
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }
  type User {
    id: ID
    username: String
    email: String
    password: String
    bookCount: Int
    savedBooks: [Book]
  }
  type Book {
    bookId: ID!
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }
  type Auth {
    token: ID!
    user: User
  }
  type Query {
    me: User
  }
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: BookInput): User
    removeBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;