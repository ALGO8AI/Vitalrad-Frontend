// @flow
import React from 'react'
import {Button, Form} from 'react-bootstrap'
import {connect} from 'react-redux'
import idx from 'idx'
import {categoryActions} from '../../_actions'
import FormValidator from '../../_helpers/FormValidator'

type Props = {
  category: any,
  match: any,
  updateDetail: Function,
  create: Function,
  detail: Function,
}

type State = {
  name: string,
  description: string,
  submitted: boolean,
  categoryId: string,
  validation: Object,
}

const checklength = (checklength: string) => {
  return checklength.length > 10 ? false : true
}

const validator = new FormValidator([
  {
    field: 'name',
    method: 'isEmpty',
    validWhen: false,
    message: 'Name is required.',
  },
  {
    field: 'description',
    method: 'isEmpty',
    validWhen: false,
    message: 'Description is required.',
  },
  {
    field: 'description',
    method: checklength,
    validWhen: false,
    message: 'Description length must be at least 10 characters long.',
  },
])

export class CategoryFormPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      name: '',
      description: '',
      submitted: false,
      categoryId: '',
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
      const {name, description, categoryId} = this.state
      if (name && description) {
        let formData = {
          name: name,
          description: description,
        }
        if (categoryId && categoryId !== '') {
          this.props.updateDetail(formData, categoryId)
        } else {
          this.props.create(formData)
        }
      }
    } else {
      this.setState({
        submitted: false,
      })
    }
  }

  clearState = () => {
    this.setState({
      name: '',
      description: '',
      submitted: false,
      validation: validator.valid(),
    })
  }

  componentDidMount() {
    //edit - get data
    if (this.props.match) {
      const {categoryID} = this.props.match.params
      if (categoryID) {
        this.setState({categoryId: categoryID})
        this.props.detail(categoryID)
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (
      idx(nextProps, _ => _.category.category._id) &&
      this.state.categoryId === ''
    ) {
      this.clearState()
    }
    if (
      idx(nextProps, _ => _.category.isProcessing) &&
      this.state.submitted !== nextProps.category.isProcessing
    ) {
      this.setState({submitted: false})
    }

    //set data
    if (
      this.state.categoryId !== '' &&
      idx(nextProps, _ => _.category.categoryDetail._id) &&
      !nextProps.category.isProcessing
    ) {
      let {categoryDetail} = nextProps.category
      this.setState({
        name: categoryDetail.name,
        description: categoryDetail.description,
      })
    }
  }

  render() {
    const {category} = this.props
    let isProcessing =
      category && category.isProcessing ? category.isProcessing : false

    const {name, description, submitted, categoryId} = this.state
    let validation
    validation = submitted // if the form has been submitted at least once
      ? validator.validate(this.state) // then check validity every time we render
      : this.state.validation // otherwise just use what's in state

    return (
      <div>
        <div className="aside-right">
          <div className="category-detail">
            <div className="create-container">
              <h4>{categoryId ? 'Edit' : 'Create'} Category</h4>
              <Form name="form" onSubmit={e => this.handleSubmit(e)}>
                <Form.Group
                  className={validation.name.isInvalid ? ' has-error' : ''}>
                  <Form.Label>Category Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={name}
                    onChange={e => this.handleChange(e)}
                  />
                  {validation.name.isInvalid && (
                    <div className="help-block">{validation.name.message}</div>
                  )}
                </Form.Group>
                <Form.Group
                  className={
                    validation.description.isInvalid ? ' has-error' : ''
                  }>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    rows="3"
                    value={description}
                    onChange={e => this.handleChange(e)}
                  />
                  {validation.description.isInvalid && (
                    <div className="help-block">
                      {validation.description.message}
                    </div>
                  )}
                </Form.Group>
                <Button type="submit" className="btn btn-primary">
                  {categoryId ? 'Update' : 'Create'}
                </Button>
                {isProcessing && (
                  <img
                    alt="Loading"
                    src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="
                  />
                )}
              </Form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({category: state.category})

const mapDispatchToProps = dispatch => ({
  create: formData => {
    dispatch(categoryActions.create(formData))
  },
  updateDetail: (formData, categoryId) => {
    dispatch(categoryActions.updateDetail(formData, categoryId))
  },
  detail: categoryId => {
    dispatch(categoryActions.detail(categoryId))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryFormPage)
