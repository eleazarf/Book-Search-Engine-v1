const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const db = require('./config/connection');
const { typeDefs, resolvers } = require('./schemas'); // Assumed location of your GraphQL schema
const { authMiddleware } = require('./utils/auth'); // Assumed utility location
// const routes = require('./routes');

async function startApolloServer() {
const app = express();
const PORT = process.env.PORT || 3001;

// Define the Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware, // Use the authMiddleware to populate the context with user info
});

await server.start(); // Ensure the server is started before applying middleware

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Replace the RESTful routes with Apollo Server as a middleware
// This disables the RESTful routes defined in routes
// app.use(routes);

// Apply Apollo GraphQL middleware and set the path to /graphql
server.applyMiddleware({ app, path: '/graphql' });

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    console.log(`🚀 GraphQL ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
}

// Call the async function to start the server
startApolloServer();