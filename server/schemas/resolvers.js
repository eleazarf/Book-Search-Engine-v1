const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    
    // "me" query to get the logged-in user's data
    me: async (_, args, context) => {
      if (context.user) {
        const foundUser = await User.findOne({ _id: context.user._id }).populate('savedBooks');
        return foundUser;
      }
      throw new Error('Not logged in');
    },
  },
  
  Mutation: {
    
    // "login" mutation to authenticate a user
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("Can't find this user");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new Error('Wrong password!');
      }

      const token = signToken(user);
      return { token, user };
    },
    
    // "addUser" mutation to create a new user
    addUser: async (_, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      if (!user) {
        throw new Error('Something is wrong!');
      }
      const token = signToken(user);
      return { token, user };
    },
    
    // "saveBook" mutation to add a book to a user's saved books
    saveBook: async (_, { bookData }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: bookData } },
          { new: true, runValidators: true }
        ).populate('savedBooks');

        if (!updatedUser) {
          throw new Error('Could not find user');
        }

        return updatedUser;
      }
      throw new Error('Not logged in');
    },
    
    // "removeBook" mutation to remove a book from a user's saved books
    removeBook: async (_, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        ).populate('savedBooks');

        if (!updatedUser) {
          throw new Error('Could not find user with this id');
        }

        return updatedUser;
      }
      throw new Error('Not logged in');
    },
  },
};

module.exports = resolvers;