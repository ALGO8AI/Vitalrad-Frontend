// @flow week
import React from 'react'
import {connect} from 'react-redux'
import './login.css'
import {userActions} from '../../_actions'
import _ from 'lodash'
import logo from '../../img/logo.jpg'
type State = {
  username: string,
  password: string,
  submitted: boolean,
}

type Props = {
  location: {pathname: string},
  history: any,
  dispatch: any,
  loggingIn?: boolean,
  logout: Function,
  login: Function,
};

export class LoginPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    if (
      this.props &&
      _.has(this.props, 'location.pathname') &&
      this.props.location.pathname === '/logout'
    ) {
      // reset login status
      this.props.logout()
    }
    this.state = {
      username: '',
      password: '',
      submitted: false,
    }
  }

  handleChange = (e: any) => {
    const {name, value} = e.target
    this.setState({[name]: value})
  }

  handleSubmit = (e: any) => {
    e.preventDefault()

    this.setState({submitted: true})
    const {username, password} = this.state
    if (username && password) {
      this.props.login(username, password)
    }
  }

  render() {
    const {loggingIn} = this.props
    const {username, password, submitted} = this.state
    return (
      <div className="container-fluid page-body-wrapper full-page-wrapper">
        <div className="content-wrapper d-flex align-items-center auth">
          <div className="row flex-grow">
            <div className="col-lg-4 mx-auto">
              <div className="auth-form-light text-left p-5">
                <div className="brand-logo">
                  <img alt="Radio" src={logo} />
                </div>
                <h4>Admin-Panel</h4>
                <h6 className="font-weight-light">Sign in to continue.</h6>
                <form className="pt-3" id="loginForm" name="form" onSubmit={e => this.handleSubmit(e)}>
                  <div className={'form-group' + (submitted && !username ? ' has-error' : '')}>
                    <input
                      type="text"
                      placeholder="User Name"
                      className="form-control"
                      name="username"
                      value={username}
                      onChange={e => this.handleChange(e)}
                    />
                    {submitted && !username && (
                      <div className="help-block">Username is required</div>
                    )}
                  </div>
                  <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
                    <input
                      type="password"
                      placeholder="Password"
                      className="form-control"
                      name="password"
                      value={password}
                      autocomple="current-password"
                      onChange={e => this.handleChange(e)}
                    />
                    {submitted && !password && (
                      <div className="help-block">Password is required</div>
                    )}
                  </div>
                  <div className="mt-3">
                    <button className="btn btn-primary">Login</button>
                      {loggingIn && <div className="loader"></div>}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  loggingIn: state.authentication.loggingIn || false,
})

const mapDispatchToProps = dispatch => ({
  login: (username, password) => {
    dispatch(userActions.login(username, password))
  },
  logout: () => {
    dispatch(userActions.logout())
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage)
