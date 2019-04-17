import React from 'react';
import { hot } from 'react-hot-loader';
import fetch from 'isomorphic-unfetch';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient, InMemoryCache } from 'apollo-boost';
import { createHttpLink } from 'apollo-link-http';

import Routes from './routes';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';

const isBrowser = (process as any).browser;

if (!isBrowser) {
  (global as any).fetch = fetch;
}

const httpLink = createHttpLink({
  uri: process.env.SERVER || 'http://localhost:4000/graphql',
  credentials: 'include',
});

const client = new ApolloClient({
  connectToDevTools: isBrowser,
  link: httpLink,
  cache: new InMemoryCache().restore({}),
});

const muiTheme = createMuiTheme({
  palette: {},
});

const App: React.FunctionComponent = () => (
  <MuiThemeProvider theme={muiTheme}>
    <ApolloProvider client={client}>
      <Routes />
    </ApolloProvider>
  </MuiThemeProvider>
);

export default hot(module)(App);
