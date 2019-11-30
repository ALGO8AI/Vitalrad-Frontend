// @flow
import React from 'react'
import 'react-chat-widget/lib/styles.css';
import {connect} from 'react-redux'
// import idx from 'idx'
import {auditActions} from '../../_actions'
import {Button} from 'react-bootstrap'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import dateformat from "dateformat"
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
  endDate: any
};

const animatedComponents = makeAnimated()

class AuditReport extends React.Component<Props, State> {
  
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
      endDate: new Date()
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
          seriesData.push({name: cval, data: [tmpCount]})
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
    let dateSeries = (graphData) ? graphData.map( s => s.Scan_Received_Date ) : [];
    return {
      chart: {
        type: 'column',
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
      },
      title: {
          text: null
      },
      xAxis: {
          categories: dateSeries,
          scrollbar: {
            enabled: true
          },
      },
      yAxis: {
          min: 0,
          title: {
              text: 'Count'
          },
          stackLabels: {
              enabled: true,
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
          y: -10,
          floating: true,
          backgroundColor:
              Highcharts.defaultOptions.legend.backgroundColor || 'white',
          borderColor: '#CCC',
          borderWidth: 1,
          shadow: false
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
              cropThreshold: 10000
          }
      },
      scrollbar: {
        enabled: true
      },
      series: this.stackColumnChartData(graphData)
    }
  }

  pieChart = (auditInfo) => {
    let pieData = (auditInfo.pieData) ? auditInfo.pieData.map( s => ({name:s.category, y: s.cat}) ) : [];
    return {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
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
          showInLegend: true
        }
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

  render() {
    const {auditInfo, hospitalFilter, modalityFilter, categoryFilter, startDate, endDate} = this.state
    
    const pieOptions = this.pieChart(auditInfo);

    const stackOptions = this.stackColumnChart(auditInfo);

    const hospitalList = this.formatFilterData('hospital')
    const modalityList = this.formatFilterData('Modality')
    const categoryList = this.formatFilterData('category')
    return (
      <div className="content-wrapper">
        <div className="row">
          <div className="col-md-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <table className="table responsive-grid">
                  <tbody>
                    <tr>
                    <td>Hospital </td>
                    <td><Select
                      name="hospitalFilter"
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      value={hospitalFilter}
                      onChange={e => this.optionClicked(e, 'hospitalFilter')}
                      isMulti
                      options={hospitalList}
                    />
                    </td>
                    <td >Modality </td>
                    <td><Select
                      name="modalityFilter"
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      value={modalityFilter}
                      onChange={e => this.optionClicked(e, 'modalityFilter')}
                      isMulti
                      options={modalityList}
                    />
                    </td><td >Category </td>
                    <td><Select
                      name="categoryFilter"
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      value={categoryFilter}
                      onChange={e => this.optionClicked(e, 'categoryFilter')}
                      isMulti
                      options={categoryList}
                    /></td>
                  </tr>
                  <tr>
                    <td >Date Range</td>
                    <td ><DatePicker
                        className="form-control"
                        name= 'startDate'
                        selected={startDate}
                        onChange={e => this.handleDateChange(e, 'startDate')}
                      /> - 
                    </td>
                    <td colSpan="2"><DatePicker
                        className="form-control"
                        name= 'endDate'
                        selected={endDate}
                        minDate={new Date()}
                        onChange={e => this.handleDateChange(e, 'endDate')}
                      />
                    </td>
                    <td colSpan="3"><Button onClick={e => this.handleFilter(e)}>Filter</Button></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <div className="d-sm-flex align-items-center mb-4">
                  <h4 className="card-title mb-sm-0">Category Split Report</h4>
                </div>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={pieOptions}
                />
              </div>
            </div>
          </div>
          <div className="col-md-6 grid-margin stretch-card">
            <div className="card">
              <div className="card-body stackChartContainer">
                <div className="d-sm-flex align-items-center mb-4">
                  <h4 className="card-title mb-sm-0">Time-Line Audit Report</h4>
                </div>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={stackOptions}
                />
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
)(AuditReport)