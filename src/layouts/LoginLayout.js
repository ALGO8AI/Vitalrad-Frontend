import React from 'react'
import Header from '../components/header/header'
import {connect} from 'react-redux'
import {history} from '../_helpers'
import {alertActions} from '../_actions'
const LoginLayout = props => {
  const {children, dispatch, alert} = props
  history.listen((location, action) => {
    // clear alert on location change
    dispatch(alertActions.clear())
  })
  return (
    <div className="wrapper">
      <Header />
      {alert.message && (
        <div className={`alert ${alert.type}`}>{alert.message}</div>
      )}
      {children}
    </div>
  )
}

const mapStateToProps = state => ({
  alert: state.alert || false,
})

export default connect(mapStateToProps)(LoginLayout) //{ LoginLayout };
