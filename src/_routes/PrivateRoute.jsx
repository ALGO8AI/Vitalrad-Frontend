import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'

export const PrivateRoute = ({component: Component, ...rest}) => (
  <Route
    {...rest}
    render={props => {
      let tmpToken = localStorage.getItem('_radioauth')
        ? JSON.parse(localStorage.getItem('_radioauth'))
        : null
      let isAllowed = false;
      if(tmpToken && tmpToken.token){
        isAllowed = true
      }
      return isAllowed ? (
        <AdminLayout>
          <Component {...props} />
        </AdminLayout>
      ) : (
        <Redirect to={{pathname: '/', state: {from: props.location}}} />
      )
    }}
  />
)
