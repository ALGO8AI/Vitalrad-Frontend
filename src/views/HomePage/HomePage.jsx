// @flow
import React from 'react'


type Props = {};
class HomePage extends React.Component<Props> {
  render() {
    return (
      <div className="content-wrapper">
        <div className="row quick-action-toolbar">
          <div className="col-md-12 grid-margin">
            <div className="card">
              <div className="card-header d-block d-md-flex">
                <h5 className="mb-0">Quick Actions</h5>
                <p className="ml-auto mb-0">How are your active users trending overtime?<i className="icon-bulb"></i></p>
              </div>
              <div className="d-md-flex row m-0 quick-action-btns" role="group" aria-label="Quick action buttons">
                <div className="col-sm-6 col-md-3 p-3 text-center btn-wrapper">
                  <button type="button" className="btn px-0"> <i className="icon-user mr-2"></i> Add Client</button>
                </div>
                <div className="col-sm-6 col-md-3 p-3 text-center btn-wrapper">
                  <button type="button" className="btn px-0"><i className="icon-docs mr-2"></i> Create Quote</button>
                </div>
                <div className="col-sm-6 col-md-3 p-3 text-center btn-wrapper">
                  <button type="button" className="btn px-0"><i className="icon-folder mr-2"></i> Enter Payment</button>
                </div>
                <div className="col-sm-6 col-md-3 p-3 text-center btn-wrapper">
                  <button type="button" className="btn px-0"><i className="icon-book-open mr-2"></i>Create Invoice</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="d-sm-flex align-items-baseline report-summary-header">
                      <h5 className="font-weight-semibold">Report Summary</h5> <span className="ml-auto">Updated Report</span> <button className="btn btn-icons border-0 p-2"><i className="icon-refresh"></i></button>
                    </div>
                  </div>
                </div>
                <div className="row report-inner-cards-wrapper">
                  <div className=" col-md -6 col-xl report-inner-card">
                    <div className="inner-card-text">
                      <span className="report-title">EXPENSE</span>
                      <h4>$32123</h4>
                      <span className="report-count"> 2 Reports</span>
                    </div>
                    <div className="inner-card-icon bg-success">
                      <i className="icon-rocket"></i>
                    </div>
                  </div>
                  <div className="col-md-6 col-xl report-inner-card">
                    <div className="inner-card-text">
                      <span className="report-title">PURCHASE</span>
                      <h4>95,458</h4>
                      <span className="report-count"> 3 Reports</span>
                    </div>
                    <div className="inner-card-icon bg-danger">
                      <i className="icon-briefcase"></i>
                    </div>
                  </div>
                  <div className="col-md-6 col-xl report-inner-card">
                    <div className="inner-card-text">
                      <span className="report-title">QUANTITY</span>
                      <h4>2650</h4>
                      <span className="report-count"> 5 Reports</span>
                    </div>
                    <div className="inner-card-icon bg-warning">
                      <i className="icon-globe-alt"></i>
                    </div>
                  </div>
                  <div className="col-md-6 col-xl report-inner-card">
                    <div className="inner-card-text">
                      <span className="report-title">RETURN</span>
                      <h4>25,542</h4>
                      <span className="report-count"> 9 Reports</span>
                    </div>
                    <div className="inner-card-icon bg-primary">
                      <i className="icon-diamond"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <div className="row income-expense-summary-chart-text">
                  <div className="col-xl-4">
                    <h5>Income And Expenses Summary</h5>
                    <p className="small text-muted">A comparison of people who mark themselves of their ineterest from the date range given above. Learn more.</p>
                  </div>
                  <div className=" col-md-3 col-xl-2">
                    <p className="income-expense-summary-chart-legend"> <span style={{'borderColor': '#6469df'}}></span> Total Income </p>
                    <h3>$ 1,766.00</h3>
                  </div>
                  <div className="col-md-3 col-xl-2">
                    <p className="income-expense-summary-chart-legend"> <span style={{'borderColor': '#37ca32'}}></span> Total Expense </p>
                    <h3>$ 5,698.30</h3>
                  </div>
                </div>
                <div className="row income-expense-summary-chart mt-3">
                  <div className="col-md-12">
                    <div className="ct-chart" id="income-expense-summary-chart"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export {HomePage}
