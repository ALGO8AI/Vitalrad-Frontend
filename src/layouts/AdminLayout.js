//flow
import React from 'react'
import {connect} from 'react-redux'
import Header from '../components/header/header'
import {alertActions} from '../_actions'
import {history} from '../_helpers'
import Asides from '../components/aside/aside'
import Footer from '../components/common/Footer'
import Page from 'react-page-loading'
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
        <Header
          toggleShow={this.toggleShow}
        />
        {alert.message && (
          <div className={`alert ${alert.type}`}>{alert.message}</div>
        )}
        <div className="container-fluid page-body-wrapper">
          <Asides />
          
          <div className="main-panel">
            <Page loader={"rotate-spin"} color={"#A9A9A9"} size={4}>
            {children}
            <Footer />
            </Page>
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
