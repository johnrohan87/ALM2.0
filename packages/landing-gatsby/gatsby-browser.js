import React from "react"
import { Provider } from "react-redux"
import store from "./src/ALM/store/store"
import { api } from './src/ALM/store/apiSlice';
import { silentAuth } from "./src/ALM/utils/auth"

class SessionCheck extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
    }
  }

  handleCheckSession = () => {
    this.setState({ loading: false })
  }

  componentDidMount() {
    silentAuth(this.handleCheckSession)
  }

  render() {
    return (
      this.state.loading === false && (
        <React.Fragment>{this.props.children}</React.Fragment>
      )
    )
  }
}

export const wrapRootElement = ({ element }) => {
  return (
    <Provider store={store}>
      <api.ApiProvider api={api}>
        <SessionCheck>{element}</SessionCheck>
      </api.ApiProvider>
    </Provider>)
}