// @flow
import React from 'react'
import {Row, Col} from 'react-bootstrap'
import Asides from '../../components/aside/aside'
import count from '../../img/count.png'
import score from '../../img/score.png'
import combined from '../../img/combined.png'
import bar from '../../img/bar.png'
import donut from '../../img/donut.png'
import multiline from '../../img/multiline.png'
type Props = {}
class HomePage extends React.Component<Props> {
  render() {
    return (
      <div>
        <Asides/>
        <div className="aside-right">
          <div className="category-detail">
            <div className="detail-container">
              <Row>
                <Col lg={3} md={3} sm={12}><img alt="" src={count} /></Col>
                <Col lg={3} md={3} sm={12}><img alt="" src={score} /></Col>
                <Col lg={3} md={3} sm={12}><img alt="" src={count} /></Col>
                <Col lg={3} md={3} sm={12}><img alt="" src={score} /></Col>

              </Row>
              <Row>
                <Col lg={6} md={6} sm={12}><img alt="" src={multiline} /></Col>
                <Col lg={6} md={6} sm={12}><img alt="" src={multiline} /></Col>
              </Row>
              <Row>
                <Col lg={4} md={4} sm={12}><img alt="" src={combined} /></Col>
                <Col lg={4} md={4} sm={12}><img alt="" src={bar} /></Col>
                <Col lg={4} md={4} sm={12}><img alt="" src={donut} /></Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export {HomePage}
