// @flow
import React from 'react'
import 'react-chat-widget/lib/styles.css';
import {connect} from 'react-redux'
// import idx from 'idx'
import {auditActions} from '../../_actions'
import {Button} from 'react-bootstrap'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'



type Props = {
  getAuditInfo: Function,
  audits: Array<any>,
}

type State = {
  showChat: boolean,
  auditInfo: Array<any>,
};

class AuditReport extends React.Component<Props, State> {
  
  constructor(props: Props) {
    super(props)

    this.state = {
      showChat: false,
      auditInfo: [],
    }
  }
  componentDidMount() {
    this.getAuditInfo()
  }
  
  getAuditInfo = () => {
    this.props.getAuditInfo()
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (nextProps.audits) {
      this.setState({auditInfo: nextProps.audits})
    }
  }

  stackChart = (graphData: any) => {
    // let legendArr = ['Cat 1', 'Cat 3', 'Cat 4', 'Cat 5'];
    // {
    //       name: 'cat 1',
    //       data: [5, 3, 4, 7, 2]
    //   }
    let catData = (graphData) ? graphData.map( s => s.Scan_Received_Date ) : [];
    console.log('catData', catData, graphData)
    let graphRowData = (graphData) ? graphData.map( s => ({name:s.category, y: s.cat}) ) : [];

  }

  render() {
    const {auditInfo} = this.state
    console.log('auditInfo', auditInfo.pieData)
    let pieData = (auditInfo.pieData) ? auditInfo.pieData.map( s => ({name:s.category, y: s.cat}) ) : [];
    const pieOptions = {
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
    if(auditInfo.graphData){
      this.stackChart(auditInfo.graphData)
    }
    // let graphData = (auditInfo.graphData) ? auditInfo.graphData.map( s => ({name:s.category, y: s.cat}) ) : [];
    const stackOptions = {chart: {
        type: 'column',
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
      },
      title: {
          text: null
      },
      xAxis: {
          categories: ['01-01-2018', '01-02-2018', '01-03-2018', '01-04-2018', '01-05-2018']
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
              }
          }
      },
      series: [{
          name: 'cat 1',
          data: [5, 3, 4, 7, 2]
      }, {
          name: 'cat2',
          data: [2, 2, 3, 2, 1]
      }, {
          name: 'cat 3',
          data: [3, 4, 4, 2, 5]
      }, {
          name: 'cat 4',
          data: [4, 1, 3, 2, 3]
      }, {
          name: 'cat 5',
          data: [1, 3, 4, 2, 5]
      }]
    };
    return (
      <div className="content-wrapper">
        <div className="row">
          <div className="col-md-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <table>
                  <tbody>
                    <tr><td >Hospital :</td><td >Modality :</td><td >Category :</td><td >Date Range</td><td ><Button>Filter</Button></td></tr>
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
              <div className="card-body">
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
})

const mapDispatchToProps = dispatch => ({
  getAuditInfo: () => {
    dispatch(auditActions.getAuditInfo())
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuditReport)