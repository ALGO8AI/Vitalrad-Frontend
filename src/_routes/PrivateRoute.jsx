import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import BlankLayout from '../layouts/BlankLayout'

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
      if(props.match.path === '/publicdiscrepancy'){
        isAllowed = true
      }
      console.log('rest', rest, props.match)
      return isAllowed ? ((props.match.path === '/publicdiscrepancy') ? (<BlankLayout>
          <Component {...props} />
        </BlankLayout>) :
        (<AdminLayout>
          <Component {...props} />
        </AdminLayout>
      )) : (
        <Redirect to={{pathname: '/', state: {from: props.location}}} />
      )
    }}
  />
)
