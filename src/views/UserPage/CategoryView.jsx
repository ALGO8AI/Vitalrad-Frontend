// @flow
import React from 'react'
import {Button} from 'react-bootstrap'
import Icon from 'react-icons-kit'
import {pencil, trash} from 'react-icons-kit/fa'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import idx from 'idx'
import Dialog from 'react-bootstrap-dialog'
import {compose} from 'redux'
import {categoryActions} from '../../_actions'

type Props = {
  category: any,
  match: any,
  categoryDeleted: boolean,
  history: any,
  deleteRecord: Function,
  detail: Function,
}

type State = {
  categoryId: string,
}

export class CategoryView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      categoryId: '',
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (
      idx(nextProps, _ => _.match.params.categoryID) &&
      this.state.categoryId !== nextProps.match.params.categoryID
    ) {
      const {categoryID} = nextProps.match.params
      this.props.detail(categoryID)
      this.setState({categoryId: categoryID})
    }
  }

  goToEdit = (e: any) => {
    this.props.history.push(`/category/edit/${this.state.categoryId}`)
  }

  deleteCategory = () => {
    if (this.state.categoryId) {
      let categoryID = this.state.categoryId
      this.props.deleteRecord(categoryID)
    }
  }

  confirmDeleteCategory = (e: any) => {
    //$FlowFixMe
    this.dialog.show({
      title: 'Delete Category',
      body: 'Are you sure you want to delete this category?',
      actions: [
        Dialog.CancelAction(),
        Dialog.OKAction(() => {
          this.deleteCategory()
        }),
      ],
      bsSize: 'small',
      onHide: dialog => {
        dialog.hide()
      },
    })
  }

  render() {
    const {category} = this.props
    const categoryDetail =
      category && category.categoryDetail ? category.categoryDetail : null
    return (
      <div>
        <div className="aside-right">
          <Dialog
            ref={el => {
              //$FlowFixMe
              this.dialog = el
            }}
          />
          <div className="category-detail">
            <div className="detail-container">
              <h2>{categoryDetail ? categoryDetail.name : null}</h2>
              <p>{categoryDetail ? categoryDetail.description : null}</p>
              <div className="btn-container">
                <Button variant="light" onClick={e => this.goToEdit(e)}>
                  <Icon icon={pencil} /> Edit
                </Button>
                <Button
                  variant="light"
                  onClick={e => this.confirmDeleteCategory(e)}>
                  <Icon icon={trash} /> Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({category: state.category})

const mapDispatchToProps = dispatch => ({
  detail: categoryId => {
    dispatch(categoryActions.detail(categoryId))
  },
  deleteRecord: categoryId => {
    dispatch(categoryActions.deleteRecord(categoryId))
  },
})

const connectedCategoryView = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)
export default connectedCategoryView(CategoryView)
