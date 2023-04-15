// const { AuthenticationError } = require('apollo-server-express');
// const { User, bookSchema} = require('../models');
// const { signToken } = require('../utils/auth');

// const resolvers = {
//   Query: {
//       me: async (parent, args, context) => {
//         if (context.user) {
//           return await User.findOne({ _id: context.user._id }).populate('savedBooks');
//         }
//         throw new AuthenticationError('You need to be logged in!');
//       },
//   },
//   Mutation: {
//     addUser: async (parent, args) => {
//         const user = await User.create(args);
//         const token = signToken(user);
//         console.log("hello")
//         return { token, user };
//       },
//     saveBook: async (parent, args, context) => {
//       const object = await {...args, user:context.user._id}
//       const book = await bookSchema.create(object)
//       const user = await User.findById(context.user._id)
//       user.savedBooks.push(book._id)
//       await user.save()
//       const finalBook = await bookSchema.findById(book._id).populate('user').populate({
//         path: 'savedBooks',
//         populate: 'savedBooks'
//       });
//       console.log(finalBook)
//       return finalBook
//     },
//     deleteBook: async (parent, { userId, book }) => {
//         return User.findOneAndUpdate(
//           { _id: userId },
//           { $pull: { savedBooks: book } },
//           { new: true }
//         );
//     },
//     login: async (parent, { email, password }) => {
//       const user = await User.findOne({ email });

//       if (!user) {
//         throw new AuthenticationError('Incorrect credentials');
//       }

//       const correctPw = await user.isCorrectPassword(password);

//       if (!correctPw) {
//         throw new AuthenticationError('Incorrect credentials');
//       }

//       const token = signToken(user);

//       return { token, user };
//     },
//   },
// };


const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("savedBooks");

        return userData;
      }
      throw new AuthenticationError("You are not logged in");
    },
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("username/password is incorrect");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("username/password is incorrect");
      }
      const token = signToken(user);

      return { token, user };
    },
    // addUser(username: String!, email: String!, password: String!): Auth
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);

      return { token, user };
    },
    // saveBook(input: BookInput): User
    saveBook: async (parent, { input }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: input } },
          { new: true }
        ).populate("savedBooks");

        return updatedUser;
      }
      throw new AuthenticationError("You must be logged in!");
    },
    // removeBook(bookId: ID!): User
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        ).populate("savedBooks");

        return updatedUser;
      }
      throw new AuthenticationError("You must be logged in!");
    },
  },
};

module.exports = resolvers;