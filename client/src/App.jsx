// Import necessary dependencies from @apollo/client
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';
import React from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';

// Create an httpLink that connects to your server URL
const httpLink = new HttpLink({
  uri: 'your-graphql-server-uri', // Replace 'your-graphql-server-uri' with your actual URI
});

// Initialize Apollo Client with the HttpLink and a new instance of InMemoryCache
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

function App() {
  // Wrap the components with ApolloProvider and pass the client as a prop
  return (
    <ApolloProvider client={client}>
      <>
        <Navbar />
        <Outlet />
      </>
    </ApolloProvider>
  );
}

export default App;
