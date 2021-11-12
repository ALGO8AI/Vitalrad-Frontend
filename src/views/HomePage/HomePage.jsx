// @flow
import React from 'react'
import {Button, Row, Col, Form, Card, CardColumns } from 'react-bootstrap'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import {authDetail, loggedInUser} from '../../_helpers'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import ReactHighcharts from 'react-highcharts';
import Highstock from 'highcharts/highstock';
import {auditActions} from '../../_actions'
import idx from 'idx'
import dateformat from "dateformat"
import {connect} from 'react-redux'
import Moment from 'react-moment'
import { CSVLink } from "react-csv";

import Highcharts from "highcharts";
// import drilldown from "highcharts/modules/drilldown.js";
// import HighchartsReact from "highcharts-react-official";
// import HighchartsExporting from 'highcharts/modules/exporting'
import PieChart from "./PieChart"
// Highcharts.setOptions({
// lang: {
// drillUpText: '[X]',
// drillDownText: ''
// }
// });
// drilldown(Highcharts);
if (typeof Highcharts === 'object') {
  // HighchartsExporting(Highcharts)
}

type Props = {
  getDashBoaordInfo: Function,
  dashboardInfo: Object,
  getAuditFilters: Function,
  getAuditByCategory: Function,
  auditfilters: Object
};

type State = {
  hospitalFilter: Array<any>,
  modalityFilter: Array<any>,
  radiologistFilter: Array<any>,
  auditfilters: Object,
  startDate: any,
  endDate: any,
  loggedInUser:string,
  dashboardInfo: Object,
  chartType: string,
  csvData: any,
  showExport: Boolean,
  auditList: Array<any>,
};

// const statIcon = ['brain', 'drop-of-blood--v2', 'dog-bone', 'gear']
// const statSubClass = ['bg-warning', 'bg-info', 'bg-error', 'bg-success']
const lineColor = {'MRI': '#76b56b', 'CT': '#e0b5b5', 'CR': '#e87c7c'}
const animatedComponents = makeAnimated()
const Charts = ReactHighcharts.withHighcharts(Highstock);
class HomePage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    let newCurrDate = new Date()
    newCurrDate.setMinutes(newCurrDate.getMinutes() - 30 *24*60)
    this.state = {
      hospitalFilter: [],
      modalityFilter: [],
      radiologistFilter: [],
      auditfilters: {},
      startDate: newCurrDate,
      endDate: new Date(),
      loggedInUser: loggedInUser(),
      chartType: 'day',
      showExport: false,
      auditList: [],
    }
  }

  componentDidMount = () => {
    this.getDashBoaordInfo()
  }

  getDashBoaordInfo = () => {
    const {startDate, endDate, hospitalFilter, modalityFilter, radiologistFilter} = this.state
    let tmpHospitalArr = (hospitalFilter) ? hospitalFilter.map( s => s.value ) : [];
    let tmpModalityArr = (modalityFilter) ? modalityFilter.map( s => s.value ) : [];
    let tmpRadiologistArr = (radiologistFilter) ? radiologistFilter.map( s => s.value ) : [];
    let nameFilterValue = '';
    let nameFilter = ''
    let tmpHospitalId = '';
    let authData = authDetail()
    if(idx(authData, _ => _.detail.user_type) && authData.detail.user_type ==='hospital'){
      let hospitalName = (idx(authData, _ => _.detail.profile.name)) ? authData.detail.profile.name : 'Hospital 7'
      tmpHospitalArr = [hospitalName]
      nameFilterValue = hospitalName
      nameFilter = 'hospital_name'
      tmpHospitalId = (idx(authData, _ => _.detail.profile.name)) ? authData.detail.profile.code : ''
      this.setState({hospitalFilter: [{value: hospitalName, label: hospitalName}]})
    }

    if(idx(authData, _ => _.detail.user_type) && authData.detail.user_type ==='doctor'){
      let hospitalName = (idx(authData, _ => _.detail.profile.hospital_name) && authData.detail.profile.hospital_name[0] !=='') ? authData.detail.profile.hospital_name[0] : 'Hospital 7'
      tmpHospitalArr = [hospitalName]
      let doctorName = (idx(authData, _ => _.detail.profile.name) && authData.detail.profile.name !=='') ? authData.detail.profile.name : ''
      nameFilterValue = doctorName
      nameFilter = 'doctor_name'
      this.setState({hospitalFilter: [{value: hospitalName, label: hospitalName}]})
    }
    if(idx(authData, _ => _.detail.user_type) && authData.detail.user_type ==='radiologist'){
      let radiologistName = (idx(authData, _ => _.detail.profile.name)) ? authData.detail.profile.name : 'Hospital 7'
      tmpRadiologistArr = [radiologistName]
      nameFilter = 'radiologist_name'
      nameFilterValue = radiologistName
      this.setState({radiologistFilter: [{value: radiologistName, label: radiologistName}]})
    }
    let formData = {
      from: dateformat(startDate, 'yyyy-mm-dd'), 
      to:dateformat(endDate, 'yyyy-mm-dd'), 
      hospital: tmpHospitalArr,
      usertype: this.state.loggedInUser,
      // hospital_name: tmpHospitalArr[0],
      // doctor_name: tmpDoctorArr[0], 
      // radiologist_name: tmpRadiologistArr[0],
      modality: tmpModalityArr, 
      radiologist: tmpRadiologistArr,
    }
    if(this.state.loggedInUser !=='superadmin'){
      formData[nameFilter] = nameFilterValue
    }
    this.props.getDashBoaordInfo(formData);

    let filterData = {
      hospital_id: tmpHospitalId
    }
    console.log('filterData', filterData, formData)
    this.props.getAuditFilters(filterData);
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (nextProps.dashboardInfo) {
      this.setState({dashboardInfo: nextProps.dashboardInfo})
    }

    if (nextProps.auditfilters && this.state.auditfilters !== nextProps.auditfilters ) {
      this.setState({auditfilters: nextProps.auditfilters})
    }

    if (nextProps.auditlist && this.state.auditList !== nextProps.auditlist ) {
      this.setState({auditList: nextProps.auditlist})
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

  clearDrillState = (e) => {
    this.setState(({showExport: false}))
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
      this.setState({showExport: true})
      const {startDate, endDate, hospitalFilter, modalityFilter} = this.state
      let tmpHospitalArr = (hospitalFilter) ? hospitalFilter.map( s => s.value ) : [];
      let tmpModalityArr = (modalityFilter) ? modalityFilter.map( s => s.value ) : [];
      let tmpCategoryArr = [name];
      let formData = {
        from: dateformat(startDate, 'yyyy-mm-dd'), 
        to:dateformat(endDate, 'yyyy-mm-dd'),  
        hospital: tmpHospitalArr, 
        modality: tmpModalityArr, 
        category: [],
        radiologist: [],
        tat: tmpCategoryArr
      }
      this.props.getAuditByCategory(formData)
    }
  }
  pieDrillDown = (dashboardInfo) => {
    const filterChartData = (e) => this.showTableData(e)
    let pieData = idx(dashboardInfo, _ => _.pieRes) ? dashboardInfo.pieRes.map( s => ({name:s.TAT_Status, y: s.cat, drilldown: s.TAT_Status}) ) : [];
    let pieTatResponse = idx(dashboardInfo, _ => _.pieTatResponse) ? dashboardInfo.pieTatResponse : {};
    let tmpPieTatResponse = {}
    tmpPieTatResponse = Object.keys(pieTatResponse).map((modKey, index) => {
      let sVal = []
      pieTatResponse[modKey].map((dataVal, index) => {
        sVal[index] = [dataVal.ScanMonth+'-'+dataVal.ScanYear  , dataVal.TatCount]
        return sVal;
      })
      return tmpPieTatResponse[modKey] = {
        'type' : 'column',
        'name': ' ',
        'id'  : modKey,
        'data' : sVal
      }

    })
    const chartOpt = {
        chart: {
          height: '45%',
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
        },
        exporting: {
          enabled: false
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
                colors: ['#e87c7c', '#76b56b', '#ffa500'],
                point: {
                  events: {
                    legendItemClick: function(e) {
                      filterChartData(e)    
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
              },
              allowPointSelect: true,
            },
            legend: {
              layout: 'horizontal',
              // align: 'center',
              // verticalAlign: 'bottom'
            },
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
          series: tmpPieTatResponse
        }
    };
    return chartOpt;
  }
  pieChart = (dashboardInfo) => {
    let pieData = idx(dashboardInfo, _ => _.pieRes) ? dashboardInfo.pieRes.map( s => ({name:s.TAT_Status, y: s.cat}) ) : [];
    return {
      chart: {
        height: '45%',
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
              },
              colors: ['#e87c7c', '#76b56b', '#ffa500', '#013220'],
          }
      },
      series: [{
          name: 'Value',
          colorByPoint: true,
          data: pieData
      }]
    }
  }
  multiLieChart = (dashboardInfo, chartType) => {
    let dateSeries = idx(dashboardInfo, _ => _.lineRes.dates) ? dashboardInfo.lineRes.dates : []
    let scrollMax = (dateSeries.length === 0) ? 0 : ((dateSeries.length >=4) ? 4 : dateSeries.length-1) 
    let lineSeries = idx(dashboardInfo, _ => _.lineRes.series) ?  dashboardInfo.lineRes.series.map( s => ({name:s.name, data: s.data, color: lineColor[s.name]}) ) : []
    if(chartType !== 'day'){
      let dateArr = this.dateSeries(dateSeries, lineSeries, chartType)
      if(dateArr.dateSeriesRow && dateArr.dateSeriesRow.length > 0){
        dateSeries = dateArr.dateSeriesRow
        lineSeries = dateArr.lineSeriesRow
      }  
    }
    return {
        chart :{
          height: '75%',
          scrollablePlotArea: {
            scrollPositionX: 1
          },
          events: {
            load() {
              this.showLoading();
              setTimeout(this.hideLoading.bind(this), 2000);
            }
          }
        },
        title: null,

        subtitle: null,

        yAxis: {
            title: {
              text: 'Total'
            }
        },
        scrollbar: {
          enabled: true
        },
        xAxis: {
          categories: dateSeries,
          max: scrollMax,
          title: {
            text: 'Scan Received Date'
          }
        },
        legend: {
            layout: 'horizontal',
            // align: 'right',
            // verticalAlign: 'middle'
        },

        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
            },
        },

        series: lineSeries,

        responsive: {
          rules: [{
              condition: {
                  maxWidth: 400
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



  getQuarter = (date) => {
    return date.getFullYear() + '-Q' + Math.ceil((date.getMonth()+ 1)/3) + '-'+(("0" + (date.getMonth() + 1)).slice(-2)) ;
  }

  listQuarters = (sDate, eDate) => {

    // Ensure start is the earlier date;
    if (sDate > eDate) {
      var t = eDate;
      eDate = sDate;
      sDate = t;
    }

    // Copy input start date do don't affect original
    sDate = new Date(sDate);
    
    // Set to 2nd of month so adding months doesn't roll over
    // and not affected by daylight saving
    sDate.setDate(2);

    // // Initialise result array with start quarter
    var startQ = this.getQuarter(sDate);
    var endQ   = this.getQuarter(eDate);
    var result = [startQ];
    
    // // List quarters from start to end
    while (startQ < endQ) {
      sDate.setMonth(sDate.getMonth() + 3);
      startQ = this.getQuarter(sDate);
      result.push(startQ);
    } 
    return sDate;
  }

  dateSeries = (dateSeries: any, columnSeries: any, chartType: string) => {
    let tmpDate = [];
    let tmpLineSeries = [];

    if(chartType === 'month'){
      dateSeries.forEach((item, i) =>{
        let dataArr = item.split('-')
        let monthStr = dataArr[1]+'-'+dataArr[2]
        let activeIndex = 0;
        if(tmpDate.indexOf(monthStr) < 0){
          tmpDate.push(monthStr)
          activeIndex = tmpDate.length-1
        }
        else
        {
          activeIndex = tmpDate.indexOf(monthStr)
        }
        columnSeries.forEach((citem, ci) =>{

          // citem.data.forEach((sitem, si) =>{
            if(tmpLineSeries[ci] && tmpLineSeries[ci].data && tmpLineSeries[ci].data.length > 0){
              if(tmpLineSeries[ci].data[activeIndex] && parseInt(tmpLineSeries[ci].data[activeIndex]) > 0){
                tmpLineSeries[ci].data[activeIndex] = parseInt(tmpLineSeries[ci].data[activeIndex]) + parseInt(citem.data[i])  
              }
              else{
                tmpLineSeries[ci].data[activeIndex] = parseInt(citem.data[i])
              }
            }
            else
            {
              tmpLineSeries[ci] = {'name' : citem.name, data: []}
              tmpLineSeries[ci].data[activeIndex] = parseInt(citem.data[i])
            }      
          // })
        })

      })
    }
    if(chartType === 'year'){
      dateSeries.forEach((item, i) =>{
        let dataArr = item.split('-')
        let monthStr = dataArr[2]
        let activeIndex = 0;
        if(tmpDate.indexOf(monthStr) < 0){
          tmpDate.push(monthStr)
          activeIndex = tmpDate.length-1
        }
        else
        {
          activeIndex = tmpDate.indexOf(monthStr)
        }
        columnSeries.forEach((citem, ci) =>{

          // citem.data.forEach((sitem, si) =>{
            if(tmpLineSeries[ci] && tmpLineSeries[ci].data && tmpLineSeries[ci].data.length > 0){
              if(tmpLineSeries[ci].data[activeIndex] && parseInt(tmpLineSeries[ci].data[activeIndex]) > 0){
                tmpLineSeries[ci].data[activeIndex] = parseInt(tmpLineSeries[ci].data[activeIndex]) + parseInt(citem.data[i])  
              }
              else{
                tmpLineSeries[ci].data[activeIndex] = parseInt(citem.data[i])
              }
            }
            else
            {
              tmpLineSeries[ci] = {'name' : citem.name, data: []}
              tmpLineSeries[ci].data[activeIndex] = parseInt(citem.data[i])
            }      
          // })
        })

      })
    }
    return {dateSeriesRow : tmpDate, 'lineSeriesRow' : tmpLineSeries}
  }

  handleChartType = (ctype: string) => {
    this.setState({chartType: ctype})
  }
  handleDateChange = (edate: any, dType) => {
    this.setState({[dType]: edate})
  }

  handleFilter = (e: any) => {
    e.preventDefault()
    this.getDashBoaordInfo()
  }

  optionClicked = (optionsList: any, optionType: string) => {
    this.setState({[optionType]: optionsList})
  }

  render() {
    const {showExport, auditList, chartType, loggedInUser, hospitalFilter, modalityFilter, radiologistFilter, startDate, endDate, dashboardInfo} = this.state
    // const pieOptions = this.pieChart(dashboardInfo);
    // const pieDrillChart = this.pieDrillDown(dashboardInfo);
    const multiLieOptions = this.multiLieChart(dashboardInfo, chartType);

    const hospitalList = this.formatFilterData('hospital')
    const modalityList = this.formatFilterData('Modality')
    const radiologistList = this.formatFilterData('radiologist')

    const modalityData = idx(dashboardInfo, _ => _.modality) ? dashboardInfo.modality : []
    let modalityRow = null
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
        dateformat(audit.Scan_Received_Date, 'dd/mm/yy'), 
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
    const modalityColor = ['#76b56b', '#e0b5b5', '#e87c7c', '#013220', '#6610f2', '#e83e8c', '#28a745', '#fd7e14']
    modalityRow = modalityData.map((mod, index) => {
      return (mod.count > 0) && <Card  key={index} style={{'backgroundColor': modalityColor[index], 'color': '#fff', 'borderRadius':'0'}}>
    <Card.Body>
      <div className="row">
            <div className="col-md-3">
              <h4 style={{'fontSize': '16px', 'fontWeight': 'bold', 'marginBottom': '0px'}}>{mod.Modality}</h4>
            </div>
            <div className="col-md-3">
              <h4 style={{'fontSize': '16px', 'fontWeight': 'bold', 'marginBottom': '0px'}}>{mod.count}</h4>
            </div>
            <div className="col-md-6" style={{'padding': '0px'}}>
              <h4 style={{'fontSize': '13px', 'fontWeight': 'bold', 'marginBottom': '0px'}}><Moment format="DD/MM/YY">{startDate}</Moment> - <Moment format="DD/MM/YY">{endDate}</Moment></h4>
            </div>
          </div>
    </Card.Body>
  </Card>
    })



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
                  <Form.Label>Radiologist</Form.Label>
                  <Select
                    name="radiologistFilter"
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    value={radiologistFilter}
                    isDisabled={(loggedInUser && loggedInUser ==='radiologist')}
                    onChange={e => this.optionClicked(e, 'radiologistFilter')}
                    isMulti
                    options={radiologistList}
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
                    dateFormat="dd/MM/yy"
                    onChange={e => this.handleDateChange(e, 'startDate')}
                  /> -  
                  <DatePicker
                    className="form-control"
                    name= 'endDate'
                    selected={endDate}
                    minDate={startDate}
                    dateFormat="dd/MM/yy"
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
        <br/>
        <div className="row">
          <div className="col-md-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="d-sm-flex align-items-baseline report-summary-header" style={{'borderBottom': '0px'}}>
                      <h5 className="font-weight-semibold">Activity</h5>
                    </div>
                  </div>
                </div>
                <div className="row report-inner-cards-wrapper">
                <CardColumns>
                  {modalityRow}
                </CardColumns>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 grid-margin stretch-card">
            <div className="card">
              <div className="card-body" style={{'padding': '0px'}}>
                <div className="d-sm-flex align-items-center mb-4">
                  <div className="heading">
                    <h4 className="card-title mb-sm-0">TAT Report</h4>
                    <div className="btn-container">
                    {(showExport && csvData.length > 1) && (<CSVLink data={csvData} filename={"tat-report.csv"} className="csvlink" target="_blank">Export To CSV <i className="icon-layers menu-icon"></i></CSVLink>)}
                    </div>
                  </div>
                </div>
                <PieChart dashboardInfo = {dashboardInfo} clearDrillState={this.clearDrillState} showTableData={this.showTableData}/>
                {/*<Charts isPureConfig={true} config={pieOptions}></Charts>*/}
              </div>
            </div>
          </div>
          <div className="col-md-6 grid-margin stretch-card">
            <div className="card">
              <div className="card-body" style={{'padding': '0px'}}>
                <div className="d-sm-flex align-items-center mb-4">
                  <div className="heading">
                    <h4 className="card-title mb-sm-0">Modality Report</h4>
                    <div className="btn-container">
                      <div className="filter"></div>
                      <div className={chartType==='year' ? 'badge badge-success p-2 white-color' : 'badge badge-danger lightbrown p-2'} title="Year Chart" onClick={e => this.handleChartType('year')}>Yearly</div>
                      <div className={chartType==='month' ? 'badge badge-success p-2 white-color' : 'badge badge-danger lightbrown p-2'} title="Month Chart" onClick={e => this.handleChartType('month')}>Monthly</div>
                      <div className={chartType==='day' ? 'badge badge-success p-2 white-color' : 'badge badge-danger lightbrown p-2'} title="Day Chart" onClick={e => this.handleChartType('day')}>Day</div>
                    </div>
                  </div>
                </div>
                <Charts isPureConfig={true} config={multiLieOptions}></Charts>
              </div>
            </div>
          </div>
        </div>  
      </div>
    )
  }
}

const mapStateToProps = state => ({
  dashboardInfo: state.audit.dashboardInfo || [],
  auditfilters: state.audit.auditfilters || [],
  ...state.audit || []
})

const mapDispatchToProps = dispatch => ({
  getDashBoaordInfo: (formData: Object) => {
    dispatch(auditActions.getDashBoaordInfo(formData))
  },
  getAuditFilters: (filterData: Object) => {
    dispatch(auditActions.getAuditFilters(filterData))
  },
  getAuditByCategory: (formData: Object) => {
    dispatch(auditActions.getAuditByCategory(formData))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage)