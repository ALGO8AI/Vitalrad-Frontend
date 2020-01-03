// @flow
/*jshint eqeqeq: false */

import React from 'react'
import 'react-chat-widget/lib/styles.css';
import {connect} from 'react-redux'
import idx from 'idx'
import {chatActions} from '../../_actions'
import './Chat.css'
import {authDetail, loggedInUser} from '../../_helpers'
type Props = {
  getComment: Function,
  saveComment: Function,
  activeDisData: Object,
  chats: Array<any>
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
  componentDidMount() {
    let authData = authDetail()
    let from_id = ''
    let from_name = ''
    if(this.state.loggedInUser){
      console.log('authData', authData)
      if(this.state.loggedInUser === "superadmin"){
        from_id = authData.detail._id
        from_name = authData.detail.username
      }
      else
      {
        from_id = (idx(authData, _ => _.detail.profile.code)) ? authData.detail.profile.code : '1001'
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
    }
    this.props.getComment(formData)
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (nextProps.chats) {
      this.setState({chatList: nextProps.chats})
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
      if (value !== '') {
        let from_id = activeDisData.Doctor_Id
        let from_name = activeDisData.Reported_By
        if(this.state.loggedInUser){
          from_id = this.state.from_id
          from_name = this.state.from_name
        }

        let formData = {
          accession_no: activeDisData.Accession_No,
          from_id: from_id,
          from_name: from_name,
          to_id: activeDisData.Radiologist_Id,
          to_name: activeDisData.Audit_Person,
          status: 'unseen',
          message: value,
          user_type: this.state.loggedInUser || 'doctor'
        }
        console.log('formData', formData)
        this.props.saveComment(formData)

        setTimeout(() => {
          this.setState({chatText: ''})
          let formData = {
            accession_no: activeDisData.Accession_No,
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
      let chatCss = (chat.from_id == this.state.from_id) ? 'card bg-primary rounded w-75 float-right z-depth-0 mb-1' : 'd-flex w-75 mb-1 left-bg-primary rounded justify-content-start'
      let chatSubClass = (chat.from_id == this.state.from_id) ? 'card-text black-text' : 'card-text black-text'
      return (<div key={index} className={chatCss}>
          <div className="card-body p-2">
            <p className={chatSubClass}>{chat.message}</p>
        </div>
      </div>
    )})
    return (
      <div className="card chat-room small-chat wide" id="myForm">
        <div className="card-header white d-flex justify-content-between p-2" id="toggle" >
          <div className="heading d-flex justify-content-start">
            <div className="profile-photo">
              <span className="state"></span>
            </div>
            <div className="data">
              <p className="name mb-0"><strong>Accession No : - {activeDisData && activeDisData.Accession_No}</strong></p>
              <p className="activity text-muted mb-0">Active now</p>
            </div>
          </div>
        </div>
        <div className="my-custom-scrollbar" id="message">
          <div className="card-body p-3">
            <div className="chat-message">
              {chatRow}
            </div>
          </div>
        </div>
        <div className="card-footer text-muted white pt-1 pb-2 px-3">
          <input type="text" id="exampleForm2" value={chatText} name="chatText" className="form-control" placeholder="Type a message..." onChange={e => this.handleChange(e)} onKeyDown={e => this.sendChat(e)} />
        </div>
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
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatPage)