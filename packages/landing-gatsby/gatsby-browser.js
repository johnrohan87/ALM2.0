import React from "react";
import { navigate } from "gatsby";
import { Auth0Provider } from "@auth0/auth0-react";
import { silentAuth } from "./src/ALM/utils/auth";
import { getStore } from "./src/ALM/store/store";
import { Provider } from "react-redux";

class SessionCheck extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  handleCheckSession = () => {
    this.setState({ loading: false });
  }

  componentDidMount() {
    silentAuth(this.handleCheckSession);
  }

  render() {
    return this.state.loading === false && (
      <React.Fragment>{this.props.children}</React.Fragment>
    );
  }
}

export const wrapRootElement = ({ element }) => {
  const store = getStore();
  const auth0Domain = process.env.GATSBY_AUTH0_DOMAIN;
  const auth0ClientId = process.env.GATSBY_AUTH0_CLIENT_ID;
  const auth0RedirectUri = process.env.GATSBY_AUTH0_CALLBACK;
  
  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || "/");
  };

  return (
    <Auth0Provider
      domain={auth0Domain}
      clientId={auth0ClientId}
      redirectUri={auth0RedirectUri}
      onRedirectCallback={onRedirectCallback}
    >
      <Provider store={store}>
        <SessionCheck>{element}</SessionCheck>
      </Provider>
    </Auth0Provider>
  );
};
