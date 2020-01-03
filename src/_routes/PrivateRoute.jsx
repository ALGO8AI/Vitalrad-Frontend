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
      const publicUrl = ['/publicdiscrepancy', '/publicaudit'] //, '/hospital', '/doctor', '/radiologist'
      if(publicUrl.find(k => k===props.match.path)){
        isAllowed = true
      }
      return isAllowed ? ((publicUrl.find(k => k===props.match.path)) ? (<BlankLayout>
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
