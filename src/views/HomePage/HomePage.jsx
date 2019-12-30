// @flow
import React from 'react'
import {Button, Row, Col, Form} from 'react-bootstrap'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import {loggedInUser} from '../../_helpers'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import ReactHighcharts from 'react-highcharts';
import Highstock from 'highcharts/highstock';

type Props = {};

type State = {
  hospitalFilter: Array<any>,
  modalityFilter: Array<any>,
  categoryFilter: Array<any>,
  auditfilters: Object,
  startDate: any,
  endDate: any,
  loggedInUser:string
};


const animatedComponents = makeAnimated()
const Charts = ReactHighcharts.withHighcharts(Highstock);
class HomePage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    let newCurrDate = new Date()
    newCurrDate.setMinutes(newCurrDate.getMinutes() - 698 *24*60)
    this.state = {
      hospitalFilter: [],
      modalityFilter: [],
      categoryFilter: [],
      auditfilters: {},
      startDate: newCurrDate,
      endDate: new Date(),
      loggedInUser: loggedInUser()
    }
  }

  formatFilterData = (dataType: string) => {
    const {auditfilters} = this.state
    let listData = (auditfilters && auditfilters[dataType]) ? auditfilters[dataType] : []
    let tmpArr = []
    tmpArr = listData.map(ele => ({
        value: ele,
        label: ele,
      }))
    return tmpArr
  }

  pieChart = (auditInfo) => {
    return {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: null,
      tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b>: {point.percentage:.1f} %'
              }
          }
      },
      series: [{
          name: 'Brands',
          colorByPoint: true,
          data: [{
              name: 'Chrome',
              y: 61.41,
              sliced: true,
              selected: true
          }, {
              name: 'Internet Explorer',
              y: 11.84
          }, {
              name: 'Firefox',
              y: 10.85
          }, {
              name: 'Edge',
              y: 4.67
          }, {
              name: 'Safari',
              y: 4.18
          }, {
              name: 'Sogou Explorer',
              y: 1.64
          }, {
              name: 'Opera',
              y: 1.6
          }, {
              name: 'QQ',
              y: 1.2
          }, {
              name: 'Other',
              y: 2.61
          }]
      }]
    }
  }
  multiLieChart = (auditInfo) => {
    return {
        title: null,

        subtitle: null,

        yAxis: {
            title: {
                text: 'Number of Employees'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },

        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                pointStart: 2010
            }
        },

        series: [{
            name: 'Installation',
            data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
        }, {
            name: 'Manufacturing',
            data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
        }, {
            name: 'Sales & Distribution',
            data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
        }, {
            name: 'Project Development',
            data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
        }, {
            name: 'Other',
            data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
        }],

        responsive: {
          rules: [{
              condition: {
                  maxWidth: 500
              },
              chartOptions: {
                  legend: {
                      layout: 'horizontal',
                      align: 'center',
                      verticalAlign: 'bottom'
                  }
              }
          }]
        }
    }
  }

  handleDateChange = (edate: any, dType) => {
    this.setState({[dType]: edate})
  }

  handleFilter = (e: any) => {
    e.preventDefault()
  }

  render() {
    const {loggedInUser, auditInfo, hospitalFilter, modalityFilter, categoryFilter, startDate, endDate} = this.state
    const pieOptions = this.pieChart(auditInfo);

    const multiLieOptions = this.multiLieChart(auditInfo);

    const hospitalList = this.formatFilterData('hospital')
    const modalityList = this.formatFilterData('Modality')
    const categoryList = this.formatFilterData('category')
    return (
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body">
            <Row >
              <Col lg={2} md={2} sm={12}>
                <Form.Group>
                  <Form.Label>Hospital</Form.Label>
                  <Select
                    name="hospitalFilter"
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    value={hospitalFilter}
                    onChange={e => this.optionClicked(e, 'hospitalFilter')}
                    isMulti
                    isDisabled={(loggedInUser && loggedInUser ==='hospital')}
                    options={hospitalList}
                  />
                </Form.Group>
              </Col>
              <Col lg={2} md={2} sm={12}>
                <Form.Group>
                  <Form.Label>Modality</Form.Label>
                  <Select
                    name="modalityFilter"
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    value={modalityFilter}
                    onChange={e => this.optionClicked(e, 'modalityFilter')}
                    isMulti
                    options={modalityList}
                  />
                </Form.Group>
              </Col>
              <Col lg={2} md={2} sm={12}>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Select
                    name="categoryFilter"
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    value={categoryFilter}
                    onChange={e => this.optionClicked(e, 'categoryFilter')}
                    isMulti
                    options={categoryList}
                  />
                </Form.Group>
              </Col>
              <Col lg={4} md={4} sm={12}>
                <Form.Group>
                  <Form.Label >Date Range</Form.Label>
                  <span className="daterow">
                  <DatePicker
                    className="form-control"
                    name= 'startDate'
                    selected={startDate}
                    onChange={e => this.handleDateChange(e, 'startDate')}
                  /> -  
                  <DatePicker
                    className="form-control"
                    name= 'endDate'
                    selected={endDate}
                    minDate={new Date()}
                    onChange={e => this.handleDateChange(e, 'endDate')}
                  />
                  </span>
                </Form.Group>
              </Col>
              <Col lg={2} md={2} sm={12}>
                <Form.Group>
                <Form.Label >&nbsp;</Form.Label>
                <Button className="form-control" onClick={e => this.handleFilter(e)}>Filter</Button>
                </Form.Group>
              </Col>
            </Row>
          </div>
        </div>
        <br />  
        <div className="row">
          <div className="col-md-6 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <div className="d-sm-flex align-items-center mb-4">
                  <h4 className="card-title mb-sm-0">TAT Report</h4>
                </div>
                <Charts isPureConfig={true} config={pieOptions}></Charts>
              </div>
            </div>
          </div>
          <div className="col-md-6 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <div className="d-sm-flex align-items-center mb-4">
                  <h4 className="card-title mb-sm-0">Modality Report</h4>
                </div>
                <Charts isPureConfig={true} config={multiLieOptions}></Charts>
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
      </div>
    )
  }
}

export {HomePage}
