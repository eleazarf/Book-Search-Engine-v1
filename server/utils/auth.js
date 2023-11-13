const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

// Refactored auth middleware for GraphQL
const authMiddleware = (context) => {
  // context is an object that has a req property in Apollo Server
  const token = context.req.body.token || context.req.headers.authorization;

  if (context.req.headers.authorization) {
    // Split the token string into an array and return actual token
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    throw new Error('You have no token!');
  }

  try {
    // verify token and get user data out of it
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    // Add the user data to the context so it can be accessed in the resolver
    context.user = data;
  } catch {
    throw new Error('invalid token!');
  }

  // The modified context will be passed to the resolver function
  return context;
};

const signToken = ({ username, email, _id }) => {
  const payload = { username, email, _id };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};

module.exports = { authMiddleware, signToken };
