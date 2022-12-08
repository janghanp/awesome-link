import { ApolloClient, InMemoryCache } from '@apollo/client';

const apolloClient = new ApolloClient({
  uri: 'https://awesome-link.vercel.app/api/graphql',
  cache: new InMemoryCache(),
});

export default apolloClient;
