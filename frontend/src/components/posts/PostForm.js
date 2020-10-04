import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addNewPost } from '../../actions/postActions'

const PostForm = ({ addNewPost }) => {

  const [ text, setText ] = useState('')

  return (
    <div className="post-form">
      <div className="bg-primary p">
        <h3>Say Something...</h3>
      </div>
      <form className="form my-1" onSubmit={e => {
        e.preventDefault()
        addNewPost({ text })
        setText('')
      }}>
        <textarea
          name="text"
          cols="30"
          rows="5"
          placeholder="Create a post"
          value={text}
          onChange={e => setText(e.target.value)}
          required
        ></textarea>
        <input type="submit" className="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  )
}

PostForm.propTypes = {
  addNewPost: PropTypes.func.isRequired,
}

export default connect( null, { addNewPost } )(PostForm)