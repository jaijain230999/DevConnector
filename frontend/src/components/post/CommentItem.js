import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { removeComment } from '../../actions/postActions'
import Moment from 'react-moment'

const CommentItem = ({ 
  comment: { _id, text, name, avatar, user, date }, 
  removeComment,
  post_id,
  auth
}) => {
  return (
    <div className="post bg-white p-1 my-1">
      <div>
        <Link to={`/profile/${user}`}>
          <img
            className="round-img"
            src={avatar}
            alt=""
          />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className="my-1">{text}</p>
        <p className="post-date">
          <Moment format="YYYY/MM/DD">{date}</Moment>
        </p>
        {
          !auth.loading && auth.user._id === user &&
          <button className="btn btn-danger" onClick={() => removeComment(post_id, _id)} type="button">
            <i className="fas fa-times" />
          </button>
        }
      </div>
    </div>
  )
}

CommentItem.propTypes = {
  comment: PropTypes.object.isRequired,
  post_id: PropTypes.string.isRequired,
  removeComment: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect( mapStateToProps, { removeComment } )(CommentItem)
