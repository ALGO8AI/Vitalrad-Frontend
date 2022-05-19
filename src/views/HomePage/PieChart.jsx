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
  dashboardInfo: Array<any>,
  showTableData: Function
}

type State = {
  dashboardInfo: Array<any>,
  chartPieTitle : string
};

class PieChart extends React.Component<Props, State> {
  
  constructor(props: Props) {
    super(props)
    this.state = {
      dashboardInfo: [],
      chartPieTitle: ''
    }
  }


  UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (nextProps.dashboardInfo && this.state.dashboardInfo !== nextProps.dashboardInfo) {
      this.setState({dashboardInfo: nextProps.dashboardInfo, chartPieTitle: ''})
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

  clearDrillState = (e) => {
    this.setState({chartPieTitle: ''})
    this.props.clearDrillState(e)
  }

  pieDrillDown = (dashboardInfo) => {
    const filterChartData = (e) => this.showTableData(e)
    const clearDrillState = (e) => this.clearDrillState(e)
    if(idx(dashboardInfo, _ => _.pieTatResponse)){
      let pieTatResponse1 = {};
      Object.keys(dashboardInfo.pieTatResponse)
      .filter(key => key !== '')
      .map((key, index) => {
        pieTatResponse1[key] = dashboardInfo.pieTatResponse[key];
        return true;
      });
    }
    let pieData = idx(dashboardInfo, _ => _.pieRes) ? dashboardInfo.pieRes.filter(val => val.TAT_Status !== '').map( s => ({name:s.TAT_Status, y: s.cat, drilldown: s.TAT_Status}) ) : [];
    let pieTatResponse = idx(dashboardInfo, _ => _.pieTatResponse) ? dashboardInfo.pieTatResponse : {};
    let tmpPieTatResponse = {}
    let chartPieTitle = this.state.chartPieTitle
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
          height: '75%',
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
          events: {
            drillup: function (e) {
              // clearDrillState(e)
              setTimeout(function () {
                  clearDrillState(e);
                  // console.log(chart.series[0].options._levelNumber);
              }, 100);
            }
          },
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
        
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    // enabled: true,
                    // format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                },
                colors: ['#e87c7c', '#76b56b', '#ffa500', '#417f68'],
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
          title: {
            text: chartPieTitle
          },
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


  shouldComponentUpdate(nextProps, nextState) {
    
    if(nextProps.dashboardInfo !== this.state.dashboardInfo){
	    return true;  
	  }
    else if(nextProps.chartPieTitle !== this.state.chartPieTitle){
      return true;  
    }
	  return false;
  }
  render() {
    const {dashboardInfo, chartPieTitle} = this.state
    const pieDrillChart = this.pieDrillDown(dashboardInfo);
    return (<React.Fragment><HighchartsReact
                  highcharts={Highcharts}
                  options={pieDrillChart}
                /><div className="chartTitle">{chartPieTitle}</div></React.Fragment>)
}

}

export default PieChart