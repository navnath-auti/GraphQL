import User from '../../model/User';
import {ApolloError} from 'apollo-server-errors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const resolvers = {
  Mutation: {
    async registerUser(_, { registerInput: { username, email, password } }) {
      // See if an old user exists with email attempting to register
      const oldUser = await User.findOne({ email });

      // throw error if that user exists
      if (oldUser) {
        throw new ApolloError(
          "A user is already registered with the email " + email,
          "USER_ALREADY_EXISTS"
        );
      }

      // Encrypt password
      const encryptedPassword = await bcrypt.hash(password, 10);

      // Build out mongoose model

      const newUser = new User({
        username: username,
        email: email.toLowerCase(),
        password: encryptedPassword,
      });

      // Create our JWT

      const token = jwt.sign({ user_id: newUser._id, email }, "Secret_Key", {
        expiresIn: 7200,
      });

      newUser.token = token;

      // Save our user in MongoDB
      const response = await newUser.save();

      return {
        id: response.id,
        ...response.toJSON(),
      };
    },
    async loginUser(_, { loginInput: { email, password } }) {
      // See if a user exists with the email and password
      const user = await User.findOne({ email });

      // check if the entered password equals the encrypted password
      if (user && (await bcrypt.compare(password, user.password))) {
        // Create new token
        const token = jwt.sign({ user_id: user._id, email }, "Secret_Key", {
          expiresIn: 7200,
        });
        // Attach token to user model that we found above
        user.token = token;

        return {
          id: user.id,
          ...user.toJSON(),
        };
      } else {
        // if user doesn't exist, return error
        throw new ApolloError("Incorrect password", "INCORRECT_PASSWORD");
      }
    },
  },
  Query: {
    user: (_, { ID }) => User.findById(ID),
  },
};

export default resolvers