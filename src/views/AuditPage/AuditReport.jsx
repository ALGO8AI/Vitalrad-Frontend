// @flow
import React from 'react'
import 'react-chat-widget/lib/styles.css';
import {connect} from 'react-redux'
// import idx from 'idx'
import {discrepancyActions} from '../../_actions'
import {Button} from 'react-bootstrap'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'



type Props = {
  getDiscrepancy: Function,
  discrepancies: Array<any>,
}

type State = {
  showChat: boolean,
  discrepancyList: Array<any>,
  accessionNo: any,
};

class AuditReport extends React.Component<Props, State> {
  
  constructor(props: Props) {
    super(props)

    this.state = {
      showChat: false,
      discrepancyList: [],
      accessionNo: '',
    }
  }
  componentDidMount() {
    this.getDiscrepancyList()
    let chart = this.refs.chart.getChart();
    chart.series[0].addPoint({x: 10, y: 12});
  }
  
  getDiscrepancyList = () => {
    this.props.getDiscrepancy()
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (nextProps.discrepancies) {
      this.setState({discrepancyList: nextProps.discrepancies})
    }
  }

  openChat = (e: any, disObj: Object) => {
    this.setState({showChat: !this.state.showChat, activeDisData: disObj})
  }

  handleClose = (e: any) => {
    this.setState({showChat: false, accessionNo: '', activeDisData: null})
  }

  render() {

    const options = {
      title: {
        text: 'My chart'
      },
      series: [{
        data: [1, 2, 3]
      }]
    }
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
                  options={options}
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
                ---
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  discrepancies: state.discrepancy.detail || [],
})

const mapDispatchToProps = dispatch => ({
  getDiscrepancy: () => {
    dispatch(discrepancyActions.listing())
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuditReport)