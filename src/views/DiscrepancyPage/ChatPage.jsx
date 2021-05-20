// @flow
/*jshint eqeqeq: false */

import React from 'react'
import 'react-chat-widget/lib/styles.css';
import {connect} from 'react-redux'
import idx from 'idx'
import {chatActions, discrepancyActions} from '../../_actions'
import './Chat.css'
import {authDetail, loggedInUser} from '../../_helpers'
import {Modal} from 'react-bootstrap'

type Props = {
  getComment: Function,
  saveComment: Function,
  activeDisData: Object,
  chats: Array<any>,
  updateNotifications: Function
}

type State = {
  chatList: Array<any>,
  chatText: string,
  loggedInUser:string,
  from_id: string,
  from_name: string
};

class ChatPage extends React.Component<Props, State> {
  
  constructor(props: Props) {
    super(props)

    this.state = {
      chatList: [],
      chatText: '',
      activeDisData: null,
      loggedInUser: loggedInUser()
    }
  }

  getName = () => {
    let authData = authDetail()
    let userName = ''
    if(loggedInUser() === 'superadmin') {
      userName = (idx(authData, _ => _.detail.username)) ? authData.detail.username : 'admin'
    }
    else
    {
      userName = (idx(authData, _ => _.detail.profile.name)) ? authData.detail.profile.name : 'Hospital 7'
    }
    return userName
  }

  handleNoticiation = (notices) => {
    if(notices.length > 0){
      let noticesIdArr = notices.map(val => val.accession_no)
      let noticesId = noticesIdArr.filter((v, i, a) => a.indexOf(v) === i); 
      let formData = {name: this.getName(), accession_arr: noticesId, _id: notices.slice(-1).pop()._id}
      this.props.updateNotifications(formData)
    } 
  }

  componentDidMount() {
    let authData = authDetail()
    let from_id = ''
    let from_name = ''
    if(this.state.loggedInUser){
      if(this.state.loggedInUser === "superadmin"){
        from_id = authData.detail._id
        from_name = authData.detail.username
      }
      else
      {
        from_id = (idx(authData, _ => _.detail._id)) ? authData.detail._id : '1001'
        from_name = (idx(authData, _ => _.detail.profile.name)) ? authData.detail.profile.name : '1001'  
      }
    }
    this.getChatList()
    this.setState({activeDisData: this.props.activeDisData, from_id: from_id, from_name: from_name})
  }
  
  getChatList = () => {
    const {activeDisData} = this.props
    let formData = {
      accession_no: activeDisData.Accession_No,
      discrepancy_status: activeDisData.Discrepency_Status,
      user_type: this.state.loggedInUser
    }
    this.props.getComment(formData)
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (nextProps.chats) {
      this.setState({chatList: nextProps.chats})
    }
    if (nextProps.chats && this.state.chatList.length === 0) {
      this.handleNoticiation(nextProps.chats)
    }
  }

  handleChange = (e: any) => {
    const {name, value} = e.target
    this.setState({[name]: value})
  }

  sendChat = (e: any) =>{
    if(e.keyCode === 13 || e.key === 'Enter'){
      const {value} = e.target
      const {activeDisData} = this.props
      const {chatList} = this.state
      if (value !== '') {
        let from_id = activeDisData.Doctor_Id
        let from_name = activeDisData.Reported_By
        if(this.state.loggedInUser){
          from_id = this.state.from_id
          from_name = this.state.from_name
        }
        let to_id = activeDisData.Radiologist_Id;
        let to_name = activeDisData.Reported_By;
        if(chatList.length > 0){
          let checkSender = chatList[chatList.length - 1]
          to_id = (checkSender.from_id === from_id) ? checkSender.to_id : checkSender.from_id
          to_name = (checkSender.from_id === from_id) ? checkSender.to_name : checkSender.from_name
        }
        let formData = {
          accession_no: activeDisData.Accession_No,
          from_id: from_id,
          from_name: from_name,
          to_id: to_id,
          to_name: to_name,
          status: 'unseen',
          message: value,
          user_type: this.state.loggedInUser || 'doctor',
          discrepancy_status: activeDisData.Discrepency_Status
        }
        this.props.saveComment(formData)

        setTimeout(() => {
          this.setState({chatText: ''})
          let formData = {
            accession_no: activeDisData.Accession_No,
            discrepancy_status: activeDisData.Discrepency_Status,
            user_type: this.state.loggedInUser
          }
          this.props.getComment(formData)
        }, 800);
      }
    }
   }

  render() {
    const {activeDisData, chatText} = this.state
    let chatList = idx(this.state, _ => _.chatList)
      ? this.state.chatList
      : []
    let chatRow = null
    chatRow = chatList.map((chat, index) => {
      // let chatname = (chat.from_id === this.state.from_id) ?  chat.from_name : chat.to_name
      let chatname = chat.from_name
      // if(chat.from_name !== 'admin'){
      //   chatname = (chat.from_id !== this.state.from_id) ?  chat.from_name : chat.to_name
      // }
      let chatCss = (chat.from_id === this.state.from_id) ? 'card bg-primary rounded w-75 float-right z-depth-0 mb-1' : 'd-flex w-75 mb-1 left-bg-primary rounded justify-content-start'
      let chatSubClass = (chat.from_id === this.state.from_id) ? 'card-text black-text' : 'card-text black-text'
      return (<div key={index} className={chatCss}>
          <div className="card-body p-2">
            <p className={chatSubClass}>{chat.message}
              <br/><span className="textRight">{chatname.charAt(0).toUpperCase() + chatname.slice(1)}</span>
            </p>
        </div>
      </div>
    )})
    return (
      <div className="card chat-room small-chat wide" id="myForm">
        <Modal.Header closeButton>
          <div className="data">
            <p className="name mb-0"><strong>Accession No : - {activeDisData && activeDisData.Accession_No}</strong></p>
            {/*<p className="activity text-muted mb-0">Active now</p>*/}
          </div>
        </Modal.Header>
        <div className="my-custom-scrollbar" id="message">
          {activeDisData && (<React.Fragment><div className="table-responsive">
              <table className="table">
            <tbody>
              <tr>
                <td className="tip-label">Raised by : </td>
                <td className="tip-value">{activeDisData.Discrepency_Raised_by}</td>
                <td className="tip-label">Date : </td>
                <td className="tip-value">{activeDisData.Scan_Received_Date}</td>
              </tr> 
              <tr>
                <td className="tip-label">Hospital : </td>
                <td className="tip-value">{activeDisData.Hospital_Name}</td>
                <td className="tip-label">Patient : </td>
                <td className="tip-value">{activeDisData.Patient_First_Name} {activeDisData.Surname}</td>
              </tr>
              <tr>
                <td className="tip-label">Modality : </td>
                <td className="tip-value">{activeDisData.Modality}</td>
                <td className="tip-label">Type : </td>
                <td className="tip-value">{activeDisData.Discrepency_Type}</td>
              </tr>
              <tr>
                <td className="tip-label">Body Part : </td>
                <td className="tip-value">{activeDisData.Body_Part}</td>
                <td className="tip-label">Status : </td>
                <td className="tip-value">{activeDisData.Discrepency_Status}</td>
              </tr>
              <tr>
                <td colSpan="4" title={activeDisData.Discrepency_Comment} className="tip-value">Comment :  {activeDisData.Discrepency_Comment.substring(0, 80)}</td>
              </tr>
            </tbody>
          </table>
          </div>
        </React.Fragment>)}
          <hr
            style={{
              color: '#aab2bd',
              backgroundColor: '#aab2bd',
            }}
        />
          <div className="card-body p-3">
            <div className="chat-message">
              {chatRow}
            </div>
          </div>
        </div>
        {(activeDisData && activeDisData.Discrepency_Status !== 'close') && (<div className="card-footer text-muted white pt-1 pb-2 px-3">
          <input type="text" autoComplete="off" id="exampleForm2" value={chatText} name="chatText" className="form-control" placeholder="Type a message..." onChange={e => this.handleChange(e)} onKeyDown={e => this.sendChat(e)} />
        </div>)}
      </div>
          
    )
  }
}

const mapStateToProps = state => ({
  chats: state.chat.detail || [],
})

const mapDispatchToProps = dispatch => ({
  saveComment: (formData) => {
    dispatch(chatActions.saveComment(formData))
  },
  getComment: (formData) => {
    dispatch(chatActions.getComment(formData))
  },
  updateNotifications: (formData: Object) => {
    dispatch(discrepancyActions.updateNotifications(formData))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatPage)