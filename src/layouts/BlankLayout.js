//flow
import React from 'react'
import {connect} from 'react-redux'
import {alertActions} from '../_actions'
import {history} from '../_helpers'

type Props = {
  alert: any,
}

type State = {isShow: boolean}

class AdminLayout extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      isShow: false,
    }
  }
  componentDidMount() {
    const {dispatch} = this.props
    history.listen((location, action) => {
      // clear alert on location change
      dispatch(alertActions.clear())
    })
  }

  componentDidUpdate() {
    const {dispatch, alert} = this.props
    if (alert.message) {
      setTimeout(() => dispatch(alertActions.clear()), 4000)
    }
  }

  toggleShow = () => {
    this.setState({isShow: !this.state.isShow})
  }
  render() {
    const {children, alert} = this.props
    return (
      <div className="container-scroller">
        {alert.message && (
          <div className={`alert ${alert.type}`}>{alert.message}</div>
        )}
        <div className="container-fluid page-body-wrapper">
          <div className="blank-panel" >
            {children}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    alert: state.alert || false,
    authentication: state.authentication.user,
  }
}
export default connect(mapStateToProps)(AdminLayout)
