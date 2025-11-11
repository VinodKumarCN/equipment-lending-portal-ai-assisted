import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const link = createHttpLink({
  uri: "http://localhost:5001/graphql",
  headers: {
    Authorization: localStorage.getItem("token") || ""
  }
});

export default new ApolloClient({
  link,
  cache: new InMemoryCache()
});
