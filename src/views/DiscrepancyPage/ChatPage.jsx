// @flow
import React from 'react'
import 'react-chat-widget/lib/styles.css';
import {connect} from 'react-redux'
import idx from 'idx'
import {chatActions} from '../../_actions'

type Props = {
  getComment: Function,
  saveComment: Function,
  activeDisData: Object,
  chats: Array<any>
}

type State = {
  chatList: Array<any>,
  chatText: string
};

class ChatPage extends React.Component<Props, State> {
  
  constructor(props: Props) {
    super(props)

    this.state = {
      chatList: [],
      chatText: '',
      activeDisData: null
    }
  }
  componentDidMount() {
    this.getChatList()
    this.setState({activeDisData: this.props.activeDisData})
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
        let formData = {
          accession_no: activeDisData.Accession_No,
          from_id: activeDisData.Doctor_Id,
          from_name: activeDisData.Reported_By,
          to_id: activeDisData.Radiologist_Id,
          to_name: activeDisData.Audit_Person,
          status: 'unseen',
          message: value,
        }
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
      let chatCss = (chat.from_id === 2) ? 'card bg-primary rounded w-75 float-right z-depth-0 mb-1' : 'd-flex w-75  justify-content-start'
      let chatSubClass = (chat.from_id === 2) ? 'card-text text-white' : 'card-text black-text'
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