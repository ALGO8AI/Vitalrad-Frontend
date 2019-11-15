//flow
import React from 'react'
import {connect} from 'react-redux'
import Header from '../components/header/header'
import {alertActions} from '../_actions'
import {history} from '../_helpers'
import Asides from '../components/aside/aside'
import Footer from '../components/common/Footer'

type Props = {
  alert: any,
}

type State = {isShow: boolean, isOrgnaization: string}

class AdminLayout extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      isShow: false,
      isOrgnaization: '',
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
        <Header
          toggleShow={this.toggleShow}
          isOrgnaization={this.state.isOrgnaization}
        />
        {alert.message && (
          <div className={`alert ${alert.type}`}>{alert.message}</div>
        )}
        <div className="container-fluid page-body-wrapper">
          <Asides />
          <div className="main-panel">
            {children}
            <Footer />
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
