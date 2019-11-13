// @flow week
import React from 'react'
import {connect} from 'react-redux'
import './login.css'
import {userActions} from '../../_actions'
import _ from 'lodash'

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
}
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
      <div className="login-container">
        <h2>Login</h2>
        <form id="loginForm" name="form" onSubmit={e => this.handleSubmit(e)}>
          <div
            className={
              'form-group' + (submitted && !username ? ' has-error' : '')
            }>
            <input
              type="email"
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
          <div
            className={
              'form-group' + (submitted && !password ? ' has-error' : '')
            }>
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
          <div className="form-group">
            <button className="btn btn-primary">Login</button>
            {loggingIn && (
              <img
                alt="Loading"
                src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="
              />
            )}
          </div>
        </form>
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
