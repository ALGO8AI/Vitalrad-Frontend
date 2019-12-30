// @flow
import React from 'react'
import 'react-chat-widget/lib/styles.css';
import {connect} from 'react-redux'
import idx from 'idx'
import {auditActions} from '../../_actions'
import {Button, Row, Col, Form} from 'react-bootstrap'
import Highcharts from 'highcharts'
import Highstock from 'highcharts/highstock';
import ReactHighcharts from 'react-highcharts';

// import HighchartsReact from 'highcharts-react-official'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import dateformat from "dateformat"
import {authDetail, loggedInUser} from '../../_helpers'

type Props = {
  getAuditInfo: Function,
  getAuditFilters: Function,
  audits: Array<any>,
  auditfilters: Object
}

type State = {
  showChat: boolean,
  auditInfo: Array<any>,
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

class ActivityReport extends React.Component<Props, State> {
  
  constructor(props: Props) {
    super(props)
    let newCurrDate = new Date()
    newCurrDate.setMinutes(newCurrDate.getMinutes() - 698 *24*60)
    this.state = {
      showChat: false,
      auditInfo: [],
      hospitalFilter: [],
      modalityFilter: [],
      categoryFilter: [],
      auditfilters: {},
      startDate: newCurrDate,
      endDate: new Date(),
      loggedInUser: loggedInUser()
    }
  }
  componentDidMount() {
    this.getAuditInfo()
    this.props.getAuditFilters()
  }
  
  getAuditInfo = () => {
    const {startDate, endDate, hospitalFilter, modalityFilter, categoryFilter} = this.state
    let tmpHospitalArr = (hospitalFilter) ? hospitalFilter.map( s => s.value ) : [];
    let tmpModalityArr = (modalityFilter) ? modalityFilter.map( s => s.value ) : [];
    let tmpCategoryArr = (categoryFilter) ? categoryFilter.map( s => s.value ) : [];

    let authData = authDetail()
    if(idx(authData, _ => _.detail.user_type) && authData.detail.user_type ==='hospital'){
      let hospitalName = (idx(authData, _ => _.detail.profile.name)) ? authData.detail.profile.name : 'Hospital 7'
      tmpHospitalArr = [hospitalName]
      this.setState({hospitalFilter: [{value: hospitalName, label: hospitalName}]})
    }
    let formData = {
      from: dateformat(startDate, 'dd-mm-yyyy'), 
      to:dateformat(endDate, 'dd-mm-yyyy'), 
      hospital: tmpHospitalArr, 
      modality: tmpModalityArr, 
      category: tmpCategoryArr
    }
    this.props.getAuditInfo(formData)
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (nextProps.audits) {
      this.setState({auditInfo: nextProps.audits})
    }

    if (nextProps.auditfilters && this.state.auditfilters !== nextProps.auditfilters ) {
      this.setState({auditfilters: nextProps.auditfilters})
    }
  }

  checkLabel = (cval, seriesData)=> {
    return (seriesData.findIndex(e => e.name === cval));
  }

  getCount = (dataSeries, dindex, cval)=> {
    let tmpCount = 0
    if(dataSeries && dataSeries[dindex]){
      let countRow = dataSeries[dindex].find(e => e.cat === cval)
      tmpCount = (countRow && countRow.count) ? countRow.count : 0
    }
    return tmpCount;
  }

  stackColumnChartData = (graphData: any) => {
    const {auditfilters} = this.state
    let legendArr = (auditfilters && auditfilters.category) ? auditfilters.category : [] ;
    let legendColors = {'Cat 1':'#8b0000', 'Cat 2':'#ffcccb', 'Cat 3':'#ffa500', 'Cat 4':'#417f68', 'Cat 5':'#013220'};
    let dateSeries = (graphData) ? graphData.map( s => s.Scan_Received_Date ) : [];
    let dataSeries = (graphData) ? graphData.map( s => s.catcount ) : [];
    let seriesData = []
    dateSeries.forEach((dval, dindex)=> {
      legendArr.forEach((cval, cindex)=> {
        let tmpSeriesData = this.checkLabel(cval, seriesData)
        if(tmpSeriesData >= 0){
          let tmpCount = this.getCount(dataSeries, dindex, cval)
          seriesData[tmpSeriesData].data.push(tmpCount)
        }
        else
        {
          let tmpCount = this.getCount(dataSeries, dindex, cval)
          seriesData.push({name: cval, color: legendColors[cval], data: [tmpCount]})
        }
      })
    })
    return seriesData;
  }

  handleChange = (e: any) => {
    const {name, value} = e.target
    this.setState({[name]: value})
  }

  handleDateChange = (edate: any, dType) => {
    this.setState({[dType]: edate})
  }

  optionClicked = (optionsList: any, optionType: string) => {
    this.setState({[optionType]: optionsList})
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

  handleFilter = (e: any) => {
    e.preventDefault()
    this.getAuditInfo()
  }


  stackColumnChart = (auditInfo) => {
    const {graphData} = auditInfo
    const filterChartData = (e) => this.showTableData(e)

    let dateSeries = (graphData) ? graphData.map( s => s.Scan_Received_Date ) : [];
    let scrollMax = (dateSeries.length === 0) ? 0 : ((dateSeries.length >=4) ? 4 : dateSeries.length-1) 
    return {
      chart: {
        type: 'column',
        scrollablePlotArea: {
            scrollPositionX: 1
        },
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
      },
      title: {
          text: null
      },
      xAxis: {
          categories: dateSeries,
          max: scrollMax,
      },
      scrollbar: {
        enabled: true
      },
      yAxis: {
          min: 0,
          title: {
              text: 'Count'
          },
          // stackLabels: {
          //     enabled: false,
          //     style: {
          //         fontWeight: 'bold',
          //         color: ( // theme
          //             Highcharts.defaultOptions.title.style &&
          //             Highcharts.defaultOptions.title.style.color
          //         ) || 'gray'
          //     }
          // }
      },
      legend: {
          align: 'right',
          x: -30,
          verticalAlign: 'top',
          // y: -10,
          // floating: true,
          backgroundColor:
              Highcharts.defaultOptions.legend.backgroundColor || 'white',
          borderColor: '#CCC',
          // borderWidth: 1,
          shadow: false,
      },
      tooltip: {
          headerFormat: '<b>{point.x}</b><br/>',
          pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
      },
      plotOptions: {
        column: {
          // stacking: 'normal',
          dataLabels: {
            enabled: true
          },
          events: {
            legendItemClick: function(e){
              filterChartData(e)
            }
          },
          cropThreshold: 10000,
        }
      },
      series: this.stackColumnChartData(graphData)
    }
  }


  render() {
    const {loggedInUser, auditInfo, hospitalFilter, modalityFilter, categoryFilter, startDate, endDate} = this.state

    const stackOptions = this.stackColumnChart(auditInfo);

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
          <div className="col-md-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <div className="d-sm-flex align-items-center mb-4">
                  <h4 className="card-title mb-sm-0">Time-Line Audit Report</h4>
                </div>
                {/*<HighchartsReact
                  highcharts={Highcharts}
                  options={stackOptions}
                />*/}
                <Charts isPureConfig={true} config={stackOptions}></Charts>
              </div>
            </div>
          </div>
        </div>   
      </div>
    )
  }
}

const mapStateToProps = state => ({
  audits: state.audit.detail || [],
  ...state.audit || []
})

const mapDispatchToProps = dispatch => ({
  getAuditInfo: (formData: Object) => {
    dispatch(auditActions.getAuditInfo(formData))
  },
  getAuditFilters: () => {
    dispatch(auditActions.getAuditFilters())
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityReport)