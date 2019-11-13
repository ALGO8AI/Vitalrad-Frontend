import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import LoginLayout from '../layouts/LoginLayout'

export const LoginRoute = ({component: Component, ...rest}) => (
  <Route
    {...rest}
    render={props =>
      (localStorage.getItem('_radioauth') && localStorage.getItem('_radioauth') !=='') ? (
        <Redirect to={{pathname: '/dashboard', state: {from: props.location}}} />
      ) : (
        <LoginLayout>
          <Component {...props} />
        </LoginLayout>
      )
    }
  />
)
