import React from 'react'
import {Button, Form, Modal} from 'react-bootstrap'
import FormValidator from '../../_helpers/FormValidator'

type Props = {
  getNameDetail: Function,
}

type State = {
	submitted: boolean,
	lastname: string,
  firstname: string,
}

const checklength = (checklength: string) => {
  return checklength.trim().length >= 3 ? false : true
}

const validator = new FormValidator([
  {
    field: 'firstname',
    method: 'isEmpty',
    validWhen: false,
    message: 'First Name is required.',
  },
  {
    field: 'firstname',
    method: checklength,
    validWhen: false,
    message: 'First Name length must be at least 3 characters long.',
  },
  {
    field: 'lastname',
    method: 'isEmpty',
    validWhen: false,
    message: 'Last Name is required.',
  },
  {
    field: 'lastname',
    method: checklength,
    validWhen: false,
    message: 'Last Name length must be at least 3 characters long.',
  }
])

export class DoctorIdForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      firstname: '',
      lastname: '',
      submitted: false,
      validation: validator.valid(),
    }
  }

  handleChange = (e: any) => {
    const {name, value} = e.target
    this.setState({[name]: value})
  }

  handleSubmit = (e: any) => {
    e.preventDefault()
    const validation = validator.validate(this.state)
    this.setState({validation})
    this.setState({submitted: true})
    if (validation.isValid) {

      const {firstname, lastname} = this.state

      if (firstname && lastname) {
        this.props.getNameDetail(firstname, lastname)
      }
    } else {
      this.setState({
        submitted: false,
      })
    }
  }

  clearState = () => {
    this.setState({
      firstname: '',
      lastname: '',
    })
  }

  render() {
  	const {alert} = this.props
    const {firstname, lastname, submitted} = this.state
    let validation
    validation = submitted // if the form has been submitted at least once
      ? validator.validate(this.state) // then check validity every time we render
      : this.state.validation // otherwise just use what's in state

  	return (
  		<div>
  			<Modal.Header closeButton>
          <Modal.Title>Manage User's Id</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {alert && alert.message && (
            <div className={`alert ${alert.type}`}>{alert.message}</div>
          )}
          <div className="hospital-detail">
            <div className="create-container">
              <Form name="form" onSubmit={e => this.handleSubmit(e)}>
                <Form.Group
                  className={validation.firstname.isInvalid ? ' has-error' : ''}>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstname"
                    value={firstname}
                    onChange={e => this.handleChange(e)}
                  />
                  {validation.firstname.isInvalid && (
                    <div className="help-block">{validation.firstname.message}</div>
                  )}
                </Form.Group>
                <Form.Group
                  className={validation.lastname.isInvalid ? ' has-error' : ''}>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastname"
                    value={lastname}
                    onChange={e => this.handleChange(e)}
                  />
                  {validation.lastname.isInvalid && (
                    <div className="help-block">{validation.lastname.message}</div>
                  )}
                </Form.Group>
                <Button type="submit" className="btn btn-primary">
                  Generate
                </Button>
              </Form>
            </div>
          </div>
        </Modal.Body>
      </div>
    )
  }
}

export default DoctorIdForm