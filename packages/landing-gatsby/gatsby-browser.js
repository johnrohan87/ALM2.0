import React from "react"
import { silentAuth } from "./src/ALM/utils/auth"
import { store } from '../../packages/landing-gatsby/src/ALM/store/store';
import { Provider } from 'react-redux';


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
        <SessionCheck>{element}</SessionCheck>
    </Provider>
  )
}