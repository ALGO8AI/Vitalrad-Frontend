// @flow
import React from 'react'
import logo from '../../img/logo.jpg'
import logomini from '../../img/logo-mini.jpg'
import {Link} from 'react-router-dom'
import {authDetail, loggedInUser, history, capitalizeString} from '../../_helpers'
import {discrepancyActions} from '../../_actions'
import {connect} from 'react-redux'
import idx from 'idx'
import {Badge} from 'react-bootstrap'
type Props = {
  toggleShow: Function,
  getNotifications: Function,
  updateNotifications: Function
}

type State = {
  notices: Array<any>
};

class Header extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      notices: [],
    }
  }

  menuClicked = (e: any) => {
    this.props.toggleShow()
  }

  getName = () => {
    let authData = authDetail()
    let userName = ''
    if(loggedInUser() === 'superadmin') {
      userName = 'superadmin'
    }
    else
    {
      userName = (idx(authData, _ => _.detail.profile.name)) ? authData.detail.profile.name : 'Hospital 7'
    }
    return userName
  }

  componentDidMount = () => {
    let formData = {name : this.getName()}
    this.props.getNotifications(formData)
  }

  handleNoticiation = (e: any) => {
    const {notices} = this.state
    if(notices.length > 0){
      // let noticesIdArr = notices.map(val => val.accession_no)
      // let noticesId = noticesIdArr.filter((v, i, a) => a.indexOf(v) === i); 
      // let formData = {name: this.getName(), accession_arr: noticesId}
      // this.props.updateNotifications(formData)
      history.push('/discrepancy')
    } 
  }

  UNSAFE_componentWillReceiveProps = (nextProps: any) => {
    if (nextProps.notices) {
      this.setState({notices: nextProps.notices})
    }
    
  }
  render() {
    let authData = authDetail()
    const {notices} = this.state
    return (
      <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
        <div className="navbar-brand-wrapper d-flex align-items-center">
          <a className="navbar-brand brand-logo" href="/">
            <img src={logo} alt="logo" className="logo-dark" />
          </a>
          <a className="navbar-brand brand-logo-mini" href="/"><img src={logomini} alt="mini logo" /></a>
        </div>
        <div className="navbar-menu-wrapper d-flex align-items-center flex-grow-1">
          {/*<h5 className="mb-0 font-weight-medium d-none d-lg-flex">Welcome Radiology dashboard!</h5>*/}
          <ul className="navbar-nav navbar-nav-right ml-auto">
            <li>
              <span onClick={e => this.handleNoticiation(e)}>
                <div className="badge badge-warning p-2" ><i className="icon-bell menu-icon"></i>
                {notices.length >0 && (<Badge variant="light" className="notice">{notices.length}</Badge>)}</div>
              </span>
            </li>
            <li className="nav-item dropdown d-none d-xl-inline-flex user-dropdown">
              <Link
                exact="true" 
                to="/account"
                className="nav-link dropdown-toggle"
                id="UserDropdown" data-toggle="dropdown" aria-expanded="false"
                >
                <span className="font-weight-normal"> {(authData && authData.detail && authData.detail.username) ? capitalizeString(authData.detail.username) : 'Admin'} </span>
              </Link>
              <div className="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="UserDropdown">
                {(authData && authData.detail && authData.detail.user_type !=='superadmin') && (<Link
                    exact="true" 
                    to="/account"
                    className="dropdown-item"
                    >
                    <i className="dropdown-item-icon icon-user text-primary"></i> My Profile </Link>)}
                <Link
                    exact="true" 
                    to="/logout"
                    className="dropdown-item"
                    >
                    <i className="dropdown-item-icon icon-power text-primary"></i>Sign Out
                  </Link>
              </div>
            </li>
          </ul>
          <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
            <span className="icon-menu"></span>
          </button>
        </div>
      </nav>
    )
  }
}

const mapStateToProps = state =>({
  discrepancies: state.discrepancy.detail || [],
  notices: state.discrepancy.notices || [],
  alert: state.alert || false,
})

const mapDispatchToProps = dispatch => ({
  getNotifications: (formData: Object) => {
    dispatch(discrepancyActions.getNotifications(formData))
  },
  updateNotifications: (formData: Object) => {
    dispatch(discrepancyActions.updateNotifications(formData))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)