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
import Moment from 'react-moment'
import {authDetail, loggedInUser} from '../../_helpers'
import { CSVLink } from "react-csv";
import {Pagination} from '../../components/common';

import drilldown from "highcharts/modules/drilldown.js";
// import HighchartsExporting from 'highcharts/modules/exporting'
import PieChart from "./PieChart"

// Highcharts.setOptions({
// lang: {
// drillUpText: '[X]'
// }
// }); 
drilldown(Highcharts);
if (typeof Highcharts === 'object') {
  // HighchartsExporting(Highcharts)
}

type Props = {
  getAuditInfo: Function,
  getAuditFilters: Function,
  getAuditByCategory: Function,
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
  auditList: Array<any>,
  auditPagingList: Array<any>,
  isTableShow: boolean,
  loggedInUser:string,
  currentPage: number,
  totalPages: number,
  pageLimit: number,
  pageFilterLimit: Object,
};

const animatedComponents = makeAnimated()
const Charts = ReactHighcharts.withHighcharts(Highstock);
class AuditReport extends React.Component<Props, State> {
  
  constructor(props: Props) {
    super(props)
    let newCurrDate = new Date()
    newCurrDate.setMinutes(newCurrDate.getMinutes() - 30 *24*60)
    this.state = {
      showChat: false,
      auditInfo: [],
      hospitalFilter: [],
      modalityFilter: [],
      categoryFilter: [],
      auditfilters: {},
      startDate: newCurrDate,
      endDate: new Date(),
      auditList: [],
      isTableShow: false,
      loggedInUser: loggedInUser(),
      totalPages: 0,
      auditPagingList: [],
      pageLimit: 15,
      pageFilterLimit: {value: 15, label: 15},
      currentPage: 1,
    }
  }
  componentDidMount() {
    this.getAuditInfo()  
  }
  
  getAuditInfo = () => {
    const {startDate, endDate, hospitalFilter, modalityFilter, categoryFilter} = this.state
    let tmpHospitalArr = (hospitalFilter) ? hospitalFilter.map( s => s.value ) : [];
    let tmpModalityArr = (modalityFilter) ? modalityFilter.map( s => s.value ) : [];
    let tmpCategoryArr = (categoryFilter) ? categoryFilter.map( s => s.value ) : [];
    let tmpHospitalId = '';
    let authData = authDetail()
    if(idx(authData, _ => _.detail.user_type) && authData.detail.user_type ==='hospital'){
      let hospitalName = (idx(authData, _ => _.detail.profile.name)) ? authData.detail.profile.name : 'Hospital 7'
      tmpHospitalArr = [hospitalName]
      tmpHospitalId = (idx(authData, _ => _.detail.profile.name)) ? authData.detail.profile.code : ''
      this.setState({hospitalFilter: [{value: hospitalName, label: hospitalName}]})
    }
    if(idx(authData, _ => _.detail.user_type) && authData.detail.user_type ==='doctor'){
      let hospitalName = (idx(authData, _ => _.detail.profile.hospital_name) && authData.detail.profile.hospital_name[0] !=='') ? authData.detail.profile.hospital_name[0] : 'Hospital 7'
      tmpHospitalArr = [hospitalName]
      this.setState({hospitalFilter: [{value: hospitalName, label: hospitalName}]})
    }
    let formData = {
      from: dateformat(startDate, 'yyyy-mm-dd'), 
      to:dateformat(endDate, 'yyyy-mm-dd'), 
      hospital: tmpHospitalArr, 
      modality: tmpModalityArr, 
      category: tmpCategoryArr
    }
    this.props.getAuditInfo(formData)

    let filterData = {
      hospital_id: tmpHospitalId
    }
    this.props.getAuditFilters(filterData);
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    // console.log('nextProps', nextProps)
    if (nextProps.audits && this.state.audits !== nextProps.audits ) {
      this.setState({auditInfo: nextProps.audits})
    }

    if (nextProps.auditfilters && this.state.auditfilters !== nextProps.auditfilters ) {
      this.setState({auditfilters: nextProps.auditfilters})
    }

    if (nextProps.auditlist && this.state.auditList !== nextProps.auditlist ) {
      this.setState({auditList: nextProps.auditlist})
      let tmpauditList = Object.assign([], nextProps.auditlist);
      const offset = (this.state.currentPage) * this.state.pageLimit;
      let tmpPagingList = tmpauditList.splice(offset, this.state.pageLimit)
      this.setState({auditPagingList: tmpPagingList})
    }
  }

  optionPageClicked = (optionsList: any) => {
    this.setState({pageLimit: optionsList.value, pageFilterLimit: optionsList})
    let tmpauditList = Object.assign([], this.state.auditList);
    const offset = 1 * optionsList.value;
    let tmpPagingList = tmpauditList.splice(offset, optionsList.value)
    this.setState({auditPagingList: tmpPagingList})
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

  clearDrillState = (e) => {
    this.setState(({isTableShow: false}))
  }

  showTableData = (e) => {
    let {name} = e.target
    if(name === undefined){
      name = e.target.innerHTML;
    }
    if(name === undefined || name === ""){
      name = e.point.name;
    }
    if(name){
      this.setState({isTableShow: true})
      const {startDate, endDate, hospitalFilter, modalityFilter} = this.state
      let tmpHospitalArr = (hospitalFilter) ? hospitalFilter.map( s => s.value ) : [];
      let tmpModalityArr = (modalityFilter) ? modalityFilter.map( s => s.value ) : [];
      let tmpCategoryArr = [name];
      let formData = {
        from: dateformat(startDate, 'yyyy-mm-dd'), 
        to:dateformat(endDate, 'yyyy-mm-dd'),  
        hospital: tmpHospitalArr, 
        modality: tmpModalityArr, 
        category: tmpCategoryArr,
        radiologist: [],
        tat: ''
      }
      this.props.getAuditByCategory(formData)
    }
  }

  hideTableData = (e:any) => {
    this.setState({isTableShow: false})
  }

  stackColumnChart = (auditInfo) => {
    const {graphData} = auditInfo
    const filterChartData = (e) => this.showTableData(e)

    let dateSeries = (graphData) ? graphData.map( s => s.Scan_Received_Date ) : [];
    let scrollMax = (dateSeries.length === 0) ? 0 : ((dateSeries.length >=4) ? 4 : dateSeries.length-1) 
    return {
      chart: {
        height: '75%',
        type: 'column',
        scrollablePlotArea: {
            scrollPositionX: 1
        },
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        events: {
          load() {
            this.showLoading();
            setTimeout(this.hideLoading.bind(this), 2000);
          }
        }
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
          stackLabels: {
              enabled: false,
              style: {
                  fontWeight: 'bold',
                  color: ( // theme
                      Highcharts.defaultOptions.title.style &&
                      Highcharts.defaultOptions.title.style.color
                  ) || 'gray'
              }
          }
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
          stacking: 'normal',
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

  pieDrillDown = (auditInfo) => {
    let pieData = (auditInfo.pieData) ? auditInfo.pieData.map( s => ({name:s.category, y: s.cat, drilldown: s.category}) ) : [];
    const filterChartData = (e) => this.showTableData(e)

    let pieCatResponse = idx(auditInfo, _ => _.pieCatResponse) ? auditInfo.pieCatResponse : {};
    let tmpPieCatResponse = {}
    tmpPieCatResponse = Object.keys(pieCatResponse).map((modKey, index) => {
      let sVal = []
      pieCatResponse[modKey].map((dataVal, index) => {
        sVal[index] = [dataVal.ScanMonth+'-'+dataVal.ScanYear  , dataVal.TatCount]
        return sVal;
      })
      return tmpPieCatResponse[modKey] = {
        'type' : 'column',
        'name': ' ',
        'id'  : modKey,
        'data' : sVal
      }
    })
    const chartOpt = {
        chart: {
          height: '75%',
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
        },
        title: null,
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
          announceNewData: {
              enabled: true
          }
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          title: null
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    // format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                },
                showInLegend: true,
                colors: ['#8b0000', '#ffcccb', '#ffa500', '#417f68', '#013220'],
                point: {
                  events: {
                    legendItemClick: function(e) {
                      // filterChartData(e)    
                    }
                  }
                },
                events: {
                  click: function(e) {
                    filterChartData(e)    
                  }
                }
            },
            series: {
              borderWidth: 0,
              showInLegend: true,
              tooltip: {
                pointFormat: '{series.name}'
              },
              dataLabels: {
                enabled: true,
              }
            }
        },
        series: [{  
            name: ' ',
            colorByPoint: true,
            data: pieData
        }],
        drilldown: {
          tooltip: {
            pointFormat: '{series.name}'
          },
          drillUpButton: {
            // relativeTo: 'spacingBox',
            position: {
              y: 0,
              x: -30
            }
          },
          plotOptions: {
            series: {
              borderWidth: 0,
              dataLabels: {
                enabled: true,
              }
            }
          },
          series: tmpPieCatResponse
        }
    };
    return chartOpt;
  }

  pieChart = (auditInfo) => {
    let pieData = (auditInfo.pieData) ? auditInfo.pieData.map( s => ({name:s.category, y: s.cat}) ) : [];
    const filterChartData = (e) => this.showTableData(e)
    return {
      chart: {
        height: '75%',
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        events: {
          load() {
            this.showLoading();
            setTimeout(this.hideLoading.bind(this), 2000);
          }
        }
      },
      title:{text: null},
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
          },
          showInLegend: true,
          colors: ['#8b0000', '#ffcccb', '#ffa500', '#417f68', '#013220'],
          point: {
            events: {
              legendItemClick: function(e) {
                filterChartData(e)    
              }
            }
          }
        }
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
      // legend: {
      //   enabled: true,
      //   layout: 'horizontal',
      //   align: 'right',
      //   verticalAlign: 'middle',
      // },
      series: [{
        name: 'Brands',
        colorByPoint: true,
        data: pieData
      }]
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if(nextProps.audits !== this.state.auditInfo){
  //     return true;  
  //   }
  //   if (nextProps.auditlist && this.state.auditList !== nextProps.auditlist ) {
  //     return true; 
  //   }

  //   return false;
  // }

  render() {
    const pageNum = [
    {value: 15, label: 15},
    {value: 30, label: 30},
    {value: 50, label: 50},
    {value: 100, label: 100},
    ]
    const {auditPagingList, pageFilterLimit, pageLimit, loggedInUser, auditInfo, hospitalFilter, modalityFilter, categoryFilter, startDate, endDate, isTableShow, auditList} = this.state
    // const pieDrillChart = this.pieDrillDown(auditInfo);
    const stackOptions = this.stackColumnChart(auditInfo);

    const hospitalList = this.formatFilterData('hospital')
    const modalityList = this.formatFilterData('Modality')
    const categoryList = this.formatFilterData('category')

    const totalActivity = auditList.length
    let auditCatRow = null
    if(auditPagingList.length > 0){
      auditCatRow = auditPagingList.map((audit, index) => {
        let tmpScanDate = audit.Scan_Received_Date.split("-");
         let scanDate = (tmpScanDate[0].length === 4) ? audit.Scan_Received_Date : audit.Scan_Received_Date.split("-").reverse().join("-");
        return (<tr key={index}>
          <td>{audit.Scan_Received_Date && (<Moment format="lll">{scanDate}</Moment>)}</td>
          <td>{audit.Reported_By}</td>
          <td>{audit.Accession_No}</td>
          <td>{audit.Hospital_Number}</td>
          <td>{audit.Hospital_Name}</td>
          <td>{audit.Patient_First_Name} {audit.Surname}</td>
          <td>{audit.Modality}</td>
          <td>{audit.Body_Part}</td>
          <td>{audit.Reported}</td>
          <td>{audit.TAT_Status}</td>
          <td>{audit.Audit_Person}</td>
          <td>{audit.Audit_Category}</td>
          <td>Appears to have used in ACC slice 354-{359 + index + 1}</td>
        </tr>
      )})
    }
    let csvData = [
      [
      "Scan Received Date", 
      "Reported By", 
      "Accession No", 
      "Hospital Number", 
      "Hospital Name", 
      "Patient Name", "Surname", "Modality", "Body Part", "Reported", "TAT Status", "Audit Person", "Audit Category"]
      ];
    auditList.map((audit, index) => ( 
      csvData.push([
        audit.Scan_Received_Date, 
        audit.Reported_By, 
        audit.Accession_No, 
        audit.Hospital_Number, 
        audit.Hospital_Name,
        audit.Patient_First_Name,
        audit.Surname,
        audit.Modality,
        audit.Body_Part,
        audit.Reported,
        audit.TAT_Status,
        audit.Audit_Person,
        audit.Audit_Category])
    ))
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
                    isDisabled={(loggedInUser && (['hospital', 'doctor'].find(k => k===loggedInUser)))}
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
                    dateFormat="yyyy-MM-dd"
                    onChange={e => this.handleDateChange(e, 'startDate')}
                  /> -  
                  <DatePicker
                    className="form-control"
                    name= 'endDate'
                    selected={endDate}
                    dateFormat="yyyy-MM-dd"
                    minDate={startDate}
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
                  <div className="heading">
                    <h4 className="card-title mb-sm-0">Category Split Report</h4>
                    <div className="btn-container">
                      {(isTableShow && csvData.length > 1) && (<CSVLink data={csvData} filename={"category-report.csv"} className="csvlink" target="_blank">Export To CSV <i className="icon-layers menu-icon"></i></CSVLink>)}
                    </div>
                  </div>
                </div>
                <PieChart auditInfo = {auditInfo} clearDrillState={this.clearDrillState} hideTableData={this.hideTableData}  showTableData={this.showTableData}/>
                {/*<Charts isPureConfig={true} config={pieDrillChart}></Charts>*/}
              </div>
            </div>
          </div>
          <div className="col-md-6 grid-margin stretch-card">
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
          {/*<Charts isPureConfig={true} config={scrollChartOptions}></Charts>

                <HighchartsReact
                  highcharts={Highcharts}
                  options={scrollChartOptions}
                />*/}
        {isTableShow && (<div className="row">
          <div className="col-md-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <CSVLink data={csvData} filename={"audit-report.csv"} className="csvlink" target="_blank">Export To CSV <i className="icon-layers menu-icon"></i></CSVLink>
                <div className="table-responsive border rounded p-1">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="font-weight-bold">Date</th>
                        <th className="font-weight-bold">Raised By</th>
                        <th className="font-weight-bold">Accession No.</th>
                        <th className="font-weight-bold">Hospital No.</th>
                        <th className="font-weight-bold">Hospital</th>
                        <th className="font-weight-bold">Patient</th>
                        <th className="font-weight-bold">Modality</th>
                        <th className="font-weight-bold">Body Part</th>
                        <th className="font-weight-bold">Report</th>
                        <th className="font-weight-bold">TAT Status</th>
                        <th className="font-weight-bold">Audit Person</th>
                        <th className="font-weight-bold">Audit Category</th>
                        <th className="font-weight-bold">Discrepancy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditCatRow}
                    </tbody>
                  </table>
                  {(auditPagingList.length > 0) && (
                    <table className="table">
                    <tbody>
                  <tr><td style={{'width': '100px'}}>
                  <Select
                    name="pageFilter"
                    closeMenuOnSelect={true}
                    components={animatedComponents}
                    onChange={e => this.optionPageClicked(e)}
                    value={pageFilterLimit}
                    options={pageNum}
                  /></td><td><Pagination 
                    totalRecords={totalActivity} 
                    pageLimit={pageLimit} 
                    pageNeighbours={1} 
                    onPageChanged={this.onPageChanged} 
                  /></td></tr>
                  </tbody>
                  </table>)}
                </div>
              </div>
            </div>
          </div>
        </div>)}
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
  getAuditByCategory: (formData: Object) => {
    dispatch(auditActions.getAuditByCategory(formData))
  },
  getAuditFilters: (filterData: Object) => {
    dispatch(auditActions.getAuditFilters(filterData))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuditReport)