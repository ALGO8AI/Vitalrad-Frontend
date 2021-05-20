// @flow
import React from 'react'
import Highcharts from 'highcharts'
import idx from 'idx'
import drilldown from "highcharts/modules/drilldown.js";
import HighchartsReact from "highcharts-react-official";

Highcharts.setOptions({
lang: {
drillUpText: '[X]',
drillDownText: ''
}
}); 
drilldown(Highcharts);

type Props = {
  auditInfo: Array<any>,
  showTableData: Function
}

type State = {
  auditInfo: Array<any>,
  chartPieTitle : string
};

class PieChart extends React.Component<Props, State> {
  
  constructor(props: Props) {
    super(props)
    this.state = {
      auditInfo: [],
      chartPieTitle: ''
    }
  }


  UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (nextProps.auditInfo && this.state.auditInfo !== nextProps.auditInfo) {
      this.setState({auditInfo: nextProps.auditInfo})
    }
  }

  showTableData = (e) => {
    let {name} = e.target
    if(name === undefined){
      name = e.target.innerHTML;
    }
    if(name === undefined || name === ""){
      name = e.point.name;
    }
    this.setState({chartPieTitle: name})
    this.props.showTableData(e)
  }

  hideTableData = (e) => {
    this.props.hideTableData(e)
  }

  clearDrillState = (e) => {
    this.setState({chartPieTitle: ''})
    this.props.clearDrillState(e)
  }

  pieDrillDown = (auditInfo) => {
    let pieData = (auditInfo.pieData) ? auditInfo.pieData.map( s => ({name:s.category, y: s.cat, drilldown: s.category}) ) : [];
    const filterChartData = (e) => this.showTableData(e)
    const hideTable = (e) => this.hideTableData(e)
    const clearDrillState = (e) => this.clearDrillState(e)
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
          events: {
            drillup: function (e) {
              hideTable(e)
            }
          }
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
          events: {
            drillup: function (e) {
              clearDrillState(e)
              this.yAxis[0].setTitle({ text: 'Count' });
            },
            drilldown: function (e) {
              this.yAxis[0].setTitle({ text: '' });
            }
          },
          drillUpButton: {
            // relativeTo: 'spacingBox',
            position: {
              y: 0,
              x: -30
            }
          },
          yAxis: {
            title: {
                text: 'Count'
            },
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


  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.auditInfo !== this.state.auditInfo){
	    return true;  
	  }
    if(nextState.chartPieTitle !== this.state.chartPieTitle){
      return true;  
    }
	  return false;
  }
  render() {
    const {auditInfo, chartPieTitle} = this.state
    const pieDrillChart = this.pieDrillDown(auditInfo);

    return (<React.Fragment><HighchartsReact
                  highcharts={Highcharts}
                  options={pieDrillChart}
                /><div className="chartTitle">{chartPieTitle}</div></React.Fragment>)
}

}

export default PieChart