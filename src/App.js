// @flow
import React, {lazy, Suspense} from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.css'
import _ from 'lodash'
import {Switch, Router, Route} from 'react-router-dom'
import {history} from './_helpers'
import {PrivateRoute, LoginRoute, PrivateRouteLinks} from './_routes'
import PageLoader from './components/common'

const LoginPage = lazy(() => import('./views/LoginPage'))
const NoMatchPage = lazy(() => import('./components/common/NoMatchPage'))

type Props = {}
class App extends React.Component<Props> {
  render() {
    return (
      <Suspense fallback={<PageLoader />}>
        <Router history={history}>
          <Switch>

            <LoginRoute exact path="/" component={LoginPage} />
            <Route exact path="/logout" component={LoginPage} />
            {_.map(PrivateRouteLinks, ({component, path, roles}, key) => {
              return (
                <Route
                  exact
                  path={path}
                  key={key}
                  render={route => (
                    <PrivateRoute
                      exact
                      component={component}
                      route={route}
                      roles={roles}
                    />
                  )}
                />
              )
            })}
            <Route component={NoMatchPage} />
            <Route exact path="*" component={LoginPage} />
          </Switch>
        </Router>
      </Suspense>
    )
  }
}

export default App
