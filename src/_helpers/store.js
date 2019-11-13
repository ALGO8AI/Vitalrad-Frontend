// @flow
import {createStore, applyMiddleware, compose} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {createLogger} from 'redux-logger'
import rootReducer from '../_reducers'

const loggerMiddleware = createLogger()

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose

let middleware = []
if (process.env.NODE_ENV === 'development') {
  middleware = [...middleware, thunkMiddleware, loggerMiddleware]
} else {
  middleware = [...middleware, thunkMiddleware]
}

const enhancer = composeEnhancers(
  applyMiddleware(...middleware)
  // other store enhancers if any
)
export const store = createStore(rootReducer, enhancer)
