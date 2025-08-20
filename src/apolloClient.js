// src/apolloClient.js
import { ApolloClient, InMemoryCache } from "@apollo/client";

export default new ApolloClient({
  uri: "https://graphql-api-brown.vercel.app/api/graphql",
  cache: new InMemoryCache(),
});
