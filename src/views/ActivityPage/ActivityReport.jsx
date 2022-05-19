// @flow
import React from 'react'
import 'react-chat-widget/lib/styles.css';
import {connect} from 'react-redux'
import idx from 'idx'
import {auditActions} from '../../_actions'
import {Button, Row, Col, Form} from 'react-bootstrap'
import Highcharts from 'highcharts'
import {Icon} from 'react-icons-kit'
import {filter} from 'react-icons-kit/fa'
// import Highstock from 'highcharts/highstock';
// import ReactHighcharts from 'react-highcharts';

// import HighchartsReact from 'highcharts-react-official'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import dateformat from "dateformat"
import {authDetail, loggedInUser} from '../../_helpers'
import Moment from 'react-moment'
import { CSVLink } from "react-csv";
import {Pagination} from '../../components/common';
// import BarDrill from './BarDrill'
import LineChart from './LineChart'
import BarChart from './BarChart'

type Props = {
  getActivityLineGraph: Function,
  getAuditFilters: Function,
  auditfilters: Object,
  getAuditByCategory: Function,
  getActivityInfo: Function
}

type State = {
  activityInfo: Array<any>,
  hospitalFilter: Array<any>,
  modalityFilter: Array<any>,
  radiologistFilter: Array<any>,
  auditfilters: Object,
  startDate: any,
  endDate: any,
  loggedInUser:string,
  auditList: Array<any>,
  auditPagingList: Array<any>,
  currentPage: number,
  totalPages: number,
  pageLimit: number,
  chartType: string,
  accession_no:string,
  pageFilterLimit: Object,
  isLabelSelected: boolean,
  yearLabel: string,
  isDataProcessing: boolean
};

const animatedComponents = makeAnimated()
// const Charts = ReactHighcharts.withHighcharts(Highstock);
const legendColors = {'Outside TAT -Reported':'#e87c7c', 'Within TAT -Reported':'#76b56b', 'Within TAT -Unreported':'#ffa500'};
class ActivityReport extends React.Component<Props, State> {
  
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
      auditList: [],
      totalPages: 0,
      pageLimit: 15,
      pageFilterLimit: {value: 15, label: 15},
      currentPage: 1,
      auditPagingList: [],
      chartType: 'yearly',
      accession_no: '',
      isLabelSelected: false,
      isDataProcessing: false,
      yearLabel: ''
    }
  }
  componentDidMount() {
    let authData = authDetail()
    let tmpHospitalId = '';
    if(idx(authData, _ => _.detail.user_type) && authData.detail.user_type ==='hospital'){
      tmpHospitalId = (idx(authData, _ => _.detail.profile.name)) ? authData.detail.profile.code : ''
    }
    let filterData = {
      hospital_id: tmpHospitalId
    }
    this.props.getAuditFilters(filterData);
    this.getActivityLineGraph()
  }
  
  getActivityLineGraph = (ctype = null) => {
    const {yearLabel, isLabelSelected, startDate, endDate, hospitalFilter, modalityFilter, radiologistFilter, accession_no, chartType } = this.state
    let tmpHospitalArr = (hospitalFilter) ? hospitalFilter.map( s => s.value ) : [];
    let tmpModalityArr = (modalityFilter) ? modalityFilter.map( s => s.value ) : [];
    let tmpRadiologistArr = (radiologistFilter) ? radiologistFilter.map( s => s.value ) : [];
    let authData = authDetail()
    // let tmpHospitalId = '';
    if(idx(authData, _ => _.detail.user_type) && authData.detail.user_type ==='hospital'){
      let hospitalName = (idx(authData, _ => _.detail.profile.name)) ? authData.detail.profile.name : 'Hospital 7'
      tmpHospitalArr = [hospitalName]
      // tmpHospitalId = (idx(authData, _ => _.detail.profile.name)) ? authData.detail.profile.code : ''
      this.setState({hospitalFilter: [{value: hospitalName, label: hospitalName}]})
    }
    if(idx(authData, _ => _.detail.user_type) && authData.detail.user_type ==='doctor'){
      let hospitalName = (idx(authData, _ => _.detail.profile.hospital_name) && authData.detail.profile.hospital_name[0] !=='') ? authData.detail.profile.hospital_name[0] : 'Hospital 7'
      tmpHospitalArr = [hospitalName]
      this.setState({hospitalFilter: [{value: hospitalName, label: hospitalName}]})
    }
    if(idx(authData, _ => _.detail.user_type) && authData.detail.user_type ==='radiologist'){
      let radiologistName = (idx(authData, _ => _.detail.profile.name)) ? authData.detail.profile.name : 'Hospital 7'
      tmpRadiologistArr = [radiologistName]
      this.setState({radiologistFilter: [{value: radiologistName, label: radiologistName}]})
    }
    // let startDates = '2018-07-21'
    // let endDates = '2019-07-21'
    let formData = {
      from: dateformat(startDate, 'yyyy-mm-dd'), 
      to:dateformat(endDate, 'yyyy-mm-dd'), 
      hospital: tmpHospitalArr, 
      modality: tmpModalityArr, 
      radiologist: tmpRadiologistArr,
      accession_no: (accession_no !== '') ? [accession_no] : [],
      tat: [],
      category:[],
      type: (ctype) ? ctype : chartType
    }
    if(isLabelSelected && yearLabel !=='' && ctype === null){
      let selectedLabelArr = yearLabel.split('-')
      // console.log('selectedLabelArr', selectedLabelArr)
      formData.requestedYear = (selectedLabelArr[1]) ? selectedLabelArr[1] : selectedLabelArr[0]
      formData.requestedMonth = (chartType === 'monthly') ? selectedLabelArr[0] : ''
      this.props.getActivityInfo(formData)
      formData.category = []
      this.props.getAuditByCategory(formData)
      this.setState({isDataProcessing: true})
    }
    else{
      this.props.getAuditByCategory(formData)
      this.setState({isDataProcessing: true}) 
      this.props.getActivityLineGraph(formData)  
    }
    
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {

    if (nextProps.activityInfo) {
      this.setState({activityInfo: nextProps.activityInfo})
    }

    if (nextProps.auditfilters && this.state.auditfilters !== nextProps.auditfilters ) {
      this.setState({auditfilters: nextProps.auditfilters})
    }
    //console.log('nextProps', nextProps)
    if (nextProps.auditlist && this.state.auditList !== nextProps.auditlist ) {
      this.setState({auditList: nextProps.auditlist})
      let tmpauditList = Object.assign([], nextProps.auditlist);
      const offset = (this.state.currentPage) * this.state.pageLimit;
      let tmpPagingList = tmpauditList.splice(offset, this.state.pageLimit)
      // console.log('tmpPagingList', tmpPagingList)
      this.setState({auditPagingList: tmpPagingList})
      setTimeout(() => {
        this.setState({isDataProcessing: false})
      }, 1000);
    }
  }

  handleDateChange = (edate: any, dType) => {
    this.setState({[dType]: edate})
  }

  optionClicked = (optionsList: any, optionType: string) => {
    this.setState({[optionType]: optionsList})
  }
  optionPageClicked = (optionsList: any) => {
    this.setState({pageLimit: optionsList.value, pageFilterLimit: optionsList})
    let tmpauditList = Object.assign([], this.state.auditList);
    const offset = 1 * optionsList.value;
    let tmpPagingList = tmpauditList.splice(offset, optionsList.value)
    this.setState({auditPagingList: tmpPagingList})
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
    this.setState({chartType:'yearly', isLabelSelected: false, yearLabel:null, auditPagingList:[]  })
    this.getActivityLineGraph('yearly')
  }

  dateSeries = (dateSeries: any, columnSeries: any, chartType: string) => {
    let tmpDate = [];
    let tmpColSeries = [];
    dateSeries.forEach((item, i) =>{
      let dataArr = item.split('-')
      if(chartType === 'month'){
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
          if(tmpColSeries[ci] && tmpColSeries[ci].data && tmpColSeries[ci].data.length > 0){
            if(tmpColSeries[ci].data[activeIndex] && parseInt(tmpColSeries[ci].data[activeIndex]) > 0){
              tmpColSeries[ci].data[activeIndex] = parseInt(tmpColSeries[ci].data[activeIndex]) + parseInt(citem.data[i])  
            }
            else{
              tmpColSeries[ci].data[activeIndex] = parseInt(citem.data[i])
            }
          }
          else
          {
            tmpColSeries[ci] = {'name' : citem.name, data: []}
            tmpColSeries[ci].data[activeIndex] = parseInt(citem.data[i])
          }      
        })
      }
      if(chartType === 'year'){
        let yearStr = dataArr[2]
        let activeIndex = 0;
        if(tmpDate.indexOf(yearStr) < 0){
          tmpDate.push(yearStr)
          activeIndex = tmpDate.length-1
        }
        else
        {
          activeIndex = tmpDate.indexOf(yearStr)
        }
        columnSeries.forEach((citem, ci) =>{
          if(tmpColSeries[ci] && tmpColSeries[ci].data && tmpColSeries[ci].data.length > 0){
            if(tmpColSeries[ci].data[activeIndex] && parseInt(tmpColSeries[ci].data[activeIndex]) > 0){
              tmpColSeries[ci].data[activeIndex] = parseInt(tmpColSeries[ci].data[activeIndex]) + parseInt(citem.data[i])  
            }
            else{
              tmpColSeries[ci].data[activeIndex] = parseInt(citem.data[i])
            }
          }
          else
          {
            tmpColSeries[ci] = {'name' : citem.name, data: []}
            tmpColSeries[ci].data[activeIndex] = parseInt(citem.data[i])
          }      
        })
      }
    })
    return {dateSeriesRow : tmpDate, 'columnSeriesRow' : tmpColSeries}
  }

  handleChartType = (ctype: string) => {
    this.setState({chartType: ctype, isLabelSelected: false, yearLabel: null, auditPagingList:[]})
    this.getActivityLineGraph(ctype)
  }

  stackColumnChart = (activityInfo, chartType) => {
    let dateSeries = idx(activityInfo, _ => _.graphRes.dates) ? activityInfo.graphRes.dates : []
    let scrollMax = (dateSeries.length === 0) ? 0 : ((dateSeries.length >=4) ? 4 : dateSeries.length-1) 
    let columnSeries = idx(activityInfo, _ => _.graphRes.series) ?  activityInfo.graphRes.series.map( s => ({name:s.name, data: s.data, color: legendColors[s.name]}) ) : []
    if(chartType === 'month'){
      let dateArr = this.dateSeries(dateSeries, columnSeries, 'month')
      if(dateArr.dateSeriesRow && dateArr.dateSeriesRow.length > 0){
        dateSeries = dateArr.dateSeriesRow
        columnSeries = dateArr.columnSeriesRow
      }
    }
    if(chartType === 'year'){
      let dateArr = this.dateSeries(dateSeries, columnSeries, 'year')
      if(dateArr.dateSeriesRow && dateArr.dateSeriesRow.length > 0){
        dateSeries = dateArr.dateSeriesRow
        columnSeries = dateArr.columnSeriesRow
      }
    }
    return {
      chart: {
        height: '30%',
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
          pointFormat: '{series.name}: {point.y}'
      },
      plotOptions: {
        column: {
          // stacking: 'normal',
          dataLabels: {
            enabled: true
          },
          cropThreshold: 10000,
        }
      },
      series: columnSeries
    }
  }

  onPageChanged = (data : any) => {
    const { currentPage } = data;
    const {pageLimit, auditList} = this.state
    if(currentPage !== this.state.currentPage){
      this.setState({currentPage: currentPage })
      const offset = (currentPage-1) * pageLimit;
      let tmpauditList = Object.assign([], auditList);
      let tmpPagingList = tmpauditList.splice(offset, pageLimit)
      this.setState({auditPagingList: tmpPagingList})
    }
  }

  handleChange = (e: any) => {
    const {name, value} = e.target
    // console.log('handleChange', name, value)
    this.setState({[name]: value})
  }

  handleAccessChange = (e: any) => {
    const {name, value} = e.target
    // console.log('handleAccessChange', name, value)
    this.setState({[name]: value})
    if (e.key === 'Enter') {
      this.getActivityLineGraph()
    }
  }

  handleAccessFilter = (e: any) => {
    // const {accession_no, auditList} = this.state;
    
    // let tmpAuditArr = [...this.state.auditList].filter((rec) =>
    //   accession_no === rec.Accession_No)
    // console.log('===', accession_no, auditList, tmpAuditArr)
    // this.getActivityLineGraph()
  }
  handleLabelChange = (yearLabel) => {
    if(!this.state.isLabelSelected){
      this.setState({isLabelSelected: (yearLabel) ? true : false, yearLabel: yearLabel})
      this.getActivityLineGraph()
    }
  }

  handleCloseBar = (chartType) => {
    this.setState({isLabelSelected: false, yearLabel: '', chartType: chartType, auditPagingList:[]})
    this.getActivityLineGraph(chartType)
  }

  render() {
    const pageNum = [
    {value: 15, label: 15},
    {value: 30, label: 30},
    {value: 50, label: 50},
    {value: 100, label: 100},
    ]
    const {isDataProcessing, isLabelSelected, yearLabel, pageFilterLimit, accession_no, chartType, pageLimit, loggedInUser, activityInfo, hospitalFilter, modalityFilter, radiologistFilter, startDate, endDate, auditList} = this.state
    // const stackOptions = this.stackColumnChart(activityInfo, chartType);
    const hospitalList = this.formatFilterData('hospital')
    const modalityList = this.formatFilterData('Modality')
    const radiologistList = this.formatFilterData('radiologist')
    let auditCatRow = null
    const totalActivity = auditList.length
    let auditPagingList = [...this.state.auditPagingList]
    if(auditPagingList.length > 0){
      if(accession_no !== ''){
        auditPagingList = [...this.state.auditPagingList].filter((rec) =>
        accession_no && rec.Accession_No.search(accession_no) >= 0
      )}
      auditCatRow = auditPagingList.map((audit, index) => {
       let tmpScanDate = audit.Scan_Received_Date.split("-");
       let scanDate = (tmpScanDate[0].length === 4) ? audit.Scan_Received_Date : audit.Scan_Received_Date.split("-").reverse().join("-");
       return (<tr key={index}>
          <td>{audit.Accession_No}</td>
          <td>{audit.Scan_Received_Date && (<Moment format="DD-MM-YYYY">{scanDate}</Moment>)}</td>
          <td>{audit.Patient_First_Name} {audit.Surname}</td>
          <td>{audit.TAT+ ' Hrs'}</td>
          <td>{audit.Body_Part}</td>
          <td>{audit.Hospital_Number}</td>
          {/*<td>{audit.Hospital_Name}</td>*/}
          <td>{audit.actualTAT}</td>
        </tr>
      )})
    }
    let csvData = [
      [
      "Accession No",
      "Scan Received Date", 
      "Patient Name",
      "Turnaround Time",
      "Modality",
      "Audit Category",
      "Body Part",
      "Hospital Number", 
      "Reported By",
      "Actual TAT"
      ]
    ];
    if(accession_no !== ''){
      auditPagingList.map((audit, index) => ( 
        csvData.push([
          audit.Accession_No,
          dateformat(audit.Scan_Received_Date, 'dd-mm-yyyy'), 
          audit.Patient_First_Name+' '+audit.Surname,
          audit.TAT+ ' Hrs',
          audit.Modality,
          audit.Audit_Category,
          audit.Body_Part,
          audit.Hospital_Number, 
          audit.Reported_By,
          audit.actualTAT
          ])
      ))
    }
    else{
      auditList.map((audit, index) => ( 
        csvData.push([
          audit.Accession_No,
          dateformat(audit.Scan_Received_Date, 'dd-mm-yyyy'), 
          audit.Patient_First_Name+' '+audit.Surname,
          audit.TAT+ ' Hrs',
          audit.Modality,
          audit.Audit_Category,
          audit.Body_Part,
          audit.Hospital_Number, 
          audit.Reported_By,
          audit.actualTAT
          ])
      ))
    }
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
                    onChange={e => this.optionClicked(e, 'radiologistFilter')}
                    isMulti
                    isDisabled={(loggedInUser && loggedInUser ==='radiologist')}
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
                    maxDate={new Date()}
                    dateFormat="dd-MM-yyyy"
                    onChange={e => this.handleDateChange(e, 'startDate')}
                  /> -  
                  <DatePicker
                    className="form-control"
                    name= 'endDate'
                    selected={endDate}
                    dateFormat="dd-MM-yyyy"
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
          <div className="col-md-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <div className="heading">
                  <h4 className="card-title mb-sm-0">Time-Line Activity Report</h4>
                  <div className="btn-container">
                    {/*<div className="filter"><Form.Control
                        type="text"
                        placeholder="Accession No"
                        name="accession_no"
                        value={accession_no}
                        onChange={e => this.handleChange(e)}
                        onKeyDown={e => this.handleAccessChange(e)}
                      /></div>*/}
                    
                    <div className={chartType==='yearly' ? 'badge badge-success p-2 white-color' : 'badge badge-danger lightbrown p-2'} title="Year Chart" onClick={e => this.handleChartType('yearly')}>Yearly</div>
                    <div className={chartType==='monthly' ? 'badge badge-success p-2 white-color' : 'badge badge-danger lightbrown p-2'} title="Month Chart" onClick={e => this.handleChartType('monthly')}>Monthly</div>
                    {/*<div className={chartType==='day' ? 'badge badge-success p-2 white-color' : 'badge badge-danger lightbrown p-2'} title="Day Chart" onClick={e => this.handleChartType('day')}>Day</div>*/}
                  </div>
                </div>
                {(!isLabelSelected || yearLabel ==='') && <LineChart activityInfo = {activityInfo} chartType={chartType} handleLabelChange={this.handleLabelChange}/>}
                {(isLabelSelected && yearLabel !=='' ) && <BarChart activityInfo = {activityInfo} chartType={chartType} handleCloseBar={this.handleCloseBar}/>}
                {/*&<BarDrill activityInfo = {activityInfo} chartType={chartType}/>*/}
                {/*<Charts isPureConfig={true} config={stackOptions}></Charts>*/}
              </div>
            </div>
          </div>
        </div>    
        {(isLabelSelected || auditPagingList.length > 0) && (<div className="row">
          <div className="col-md-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                {(auditPagingList.length > 0) && (<CSVLink data={csvData} filename={"activity-report.csv"} className="csvlink" target="_blank">Export To CSV <i className="icon-layers menu-icon"></i></CSVLink>)}
                <Form.Control
                    type="text"
                    placeholder="Accession No"
                    name="accession_no"
                    value={accession_no}
                    onChange={e => this.handleChange(e)}
                    onKeyDown={e => this.handleAccessChange(e)}
                    style={{'float':'left', 'width': '30%', 'marginBottom':'5px', 'height': 'calc(1.5em + 0.75rem + 0px)'}}
                  />
                  <Button className="btn-primary" onClick={e => this.handleAccessFilter(e)}>
                  <Icon icon={filter} />
                </Button>
                <div className="table-responsive border rounded p-1">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="font-weight-bold">Accession No.</th>
                        <th className="font-weight-bold">Date</th>
                        <th className="font-weight-bold">Patient</th>
                        <th className="font-weight-bold">Turnaround Time</th>
                        <th className="font-weight-bold">Body Part</th>
                        {/*<th className="font-weight-bold">Hospital No.</th>*/}
                        <th className="font-weight-bold">Hospital</th>
                        <th className="font-weight-bold">Actual TAT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditCatRow}
                    </tbody>
                  </table>
                  {(auditPagingList.length > 1) && (
                    <table className="table">
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
                  /></td></tr></table>)}
                </div>
              </div>
            </div>
          </div>
        </div>)}
        {isDataProcessing ? <div style={{'textAlign':'center'}}><div className="loader" style={{'display': 'block'}}></div></div> : ''}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ...state.audit || [],
})

const mapDispatchToProps = dispatch => ({
  getActivityLineGraph: (formData: Object) => {
    dispatch(auditActions.getActivityLineGraph(formData))
  },
  getActivityInfo: (formData: Object) => {
    dispatch(auditActions.getActivityInfo(formData))
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
)(ActivityReport)