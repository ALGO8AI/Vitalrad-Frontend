// @flow
import React from 'react'
import Highcharts from 'highcharts'
import idx from 'idx'
import drilldown from "highcharts/modules/drilldown.js";
import HighchartsReact from "highcharts-react-official";
import { $ }  from 'react-jquery-plugin'

Highcharts.setOptions({
lang: {
drillUpText: '[X]',
drillDownText: ''
}
}); 
drilldown(Highcharts);

type Props = {
  activityInfo: Array<any>,
  chartType: any,
  showTableData: Function
}

type State = {
  activityInfo: Array<any>,
  chartType: any,
  chartPieTitle : string
};
const legendColors = {'Outside TAT -Reported':'#e87c7c', 'Within TAT -Reported':'#76b56b', 'Within TAT -Unreported':'#ffa500'};
class BarDrill extends React.Component<Props, State> {
  
  constructor(props: Props) {
    super(props)
    this.state = {
      activityInfo: [],
      chartPieTitle: '',
      chartType: '',
    }
  }

  componentDidMount() {
    $(document).on( 'click', '.highcharts-axis-labels text, .highcharts-axis-labels span', function(){
      console.log(this.textContent || this.innerText);
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (nextProps.activityInfo && this.state.activityInfo !== nextProps.activityInfo) {
      this.setState({activityInfo: nextProps.activityInfo})
    }
    if (nextProps.chartType && this.state.chartType !== nextProps.chartType) {
      this.setState({chartType: nextProps.chartType})
    }
  }

  dateSeries = (dateSeries: any, columnSeries: any, chartType: string) => {
    let tmpDate = [];
    let tmpColSeries = [];
    dateSeries.forEach((item, i) =>{
      // console.log('item', item, i)
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
              let dval = parseInt(tmpColSeries[ci].data[activeIndex].y) + parseInt(citem.data[i])  
              tmpColSeries[ci].data[activeIndex] = { y: dval,drilldown: yearStr}
            }
            else{
              tmpColSeries[ci].data[activeIndex] = { y: parseInt(citem.data[i]),drilldown: yearStr}
            }
          }
          else
          {
            tmpColSeries[ci] = {'name' : citem.name, data: []}
            tmpColSeries[ci].data[activeIndex] = { y: parseInt(citem.data[i]),drilldown: yearStr}
          }      
        })
      }
    })
    return {dateSeriesRow : tmpDate, 'columnSeriesRow' : tmpColSeries}
  }

  stackColumnChart = (activityInfo, chartType) => {
    // console.log('chartType', chartType)
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
      // console.log('dateSeries', dateSeries, columnSeries)
      // let tmpDate = [];
      // let tmpColSeries = [];
      // let tmpCatSeries=[];
      // dateSeries.forEach((item, i) =>{
      //   let dataArr = item.split('-')
      //   let yearStr = dataArr[2]
      //   if(tmpDate.indexOf(yearStr) < 0){
      //     tmpDate.push(yearStr)
      //     tmpColSeries = {...tmpColSeries, ...{[yearStr]: [item]}};
      //   }
      //   else
      //   {
      //     tmpColSeries[yearStr].push(item)
      //   }
      // })
      // Object.keys(tmpColSeries).forEach((citem, i) =>{
      //   tmpCatSeries.push({[citem]: {
      //     'type' : 'column',
      //     'name': ' ',
      //     'id'  : citem,
      //     'data' : []
      //   }})
      //   columnSeries.forEach((mitem, ci) =>{
      //     console.log('mitem', mitem, ci)
      //     tmpCatSeries[citem].data[ci] = {name: mitem.name, color: mitem.color, data: []}
      //     if(tmpColSeries[citem].length > 0){
      //       tmpColSeries[citem].forEach((vitem, i) =>{
              
      //         let dateIndex = dateSeries.indexOf(vitem)
      //         if(dateIndex >=0 ){
      //           tmpCatSeries[citem].data[ci].data.push(mitem.data[dateIndex])
      //         }
      //       })
      //     }    
      //   })

        
      // })

      
      // console.log('tmpPieTatResponse', tmpDate, tmpColSeries, columnSeries, tmpCatSeries)
      let dateArr = this.dateSeries(dateSeries, columnSeries, 'year')
      if(dateArr.dateSeriesRow && dateArr.dateSeriesRow.length > 0){
        dateSeries = dateArr.dateSeriesRow
        columnSeries = dateArr.columnSeriesRow
      }
    }

    // console.log('dateSeries', dateSeries, columnSeries)
    return {
      chart: {
        height: '30%',
        type: 'line',
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
        labels: {
          events: {                        
            click: function() {
              alert(this.x);  
              console.log('this.x', this.x)                              
            }
          }
        }
      },
      scrollbar: {
        enabled: true
      },
      yAxis: {
          min: 0,
          title: {
              text: 'Count'
          },
          labels: {
            events: {
                click: function () {
                  console.log('this.x', this)  
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
      series: columnSeries,
      drilldown: {
          title: {
            text: 'chartPieTitle'
          },
          tooltip: {
            pointFormat: '{series.name}'
          },
          events: {
            drillup: function (e) {
              // clearDrillState(e)
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
          // series: tmpPieTatResponse
        }
    }
  }


  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.activityInfo !== this.state.activityInfo){
	    return true;  
	  }
    if(nextState.chartPieTitle !== this.state.chartPieTitle){
      return true;  
    }
    if(nextState.chartType !== this.state.chartType){
      return true;  
    }
	  return false;
  }
  render() {
    const {activityInfo, chartPieTitle, chartType} = this.state
    // const pieDrillChart = this.pieDrillDown(activityInfo);
    const pieDrillChart = this.stackColumnChart(activityInfo, chartType);
    return (<React.Fragment><HighchartsReact
                  highcharts={Highcharts}
                  options={pieDrillChart}
                /><div className="chartTitle">{chartPieTitle}</div></React.Fragment>)
}

}

export default BarDrill