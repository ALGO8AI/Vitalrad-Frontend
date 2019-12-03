// @flow
import React from 'react'
import logo from '../../img/logo.jpg'
import logomini from '../../img/logo-mini.jpg'
import {Link} from 'react-router-dom'
type Props = {
  toggleShow: Function,
}

type State = {};

class Header extends React.Component<Props, State> {
  menuClicked = (e: any) => {
    this.props.toggleShow()
  }

  render() {
    return (
      <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
        <div className="navbar-brand-wrapper d-flex align-items-center">
          <a className="navbar-brand brand-logo" href="/">
            <img src={logo} alt="logo" className="logo-dark" />
          </a>
          <a className="navbar-brand brand-logo-mini" href="/"><img src={logomini} alt="mini logo" /></a>
        </div>
        <div className="navbar-menu-wrapper d-flex align-items-center flex-grow-1">
          <h5 className="mb-0 font-weight-medium d-none d-lg-flex">Welcome Radiology dashboard!</h5>
          <ul className="navbar-nav navbar-nav-right ml-auto">
            <li className="nav-item dropdown d-none d-xl-inline-flex user-dropdown">
              <Link
                exact="true" 
                to="/profile"
                className="nav-link dropdown-toggle"
                id="UserDropdown" data-toggle="dropdown" aria-expanded="false"
                >
                <span className="font-weight-normal"> Dear Admin </span>
              </Link>
              <div className="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="UserDropdown">
                <div className="dropdown-header text-center">
                  <p className="mb-1 mt-3">Admin</p>
                  <p className="font-weight-light text-muted mb-0">admin@gmail.com</p>
                </div>
                <Link
                    exact="true" 
                    to="/profile"
                    className="dropdown-item"
                    >
                    <i className="dropdown-item-icon icon-user text-primary"></i> My Profile <span className="badge badge-pill badge-danger">1</span>
                  </Link>
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
export default Header
