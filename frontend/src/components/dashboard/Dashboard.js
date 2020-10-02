import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import Spinner from '../layout/Spinner'

import { connect } from 'react-redux'
import { getCurrentProfile } from '../../actions/profileActions'
import { Link } from 'react-router-dom'

const Dashboard = ({ getCurrentProfile, auth: { user }, profile: { profile, loading } }) => {
  useEffect(() => {
    getCurrentProfile()
  }, [getCurrentProfile])

  return loading && profile === null 
    ? <Spinner />
    : <>
        <h1 className="large text-primary">Dashboard</h1>
        <p className="lead">
          <i className="fas fa-user" />{' '}Welcome { user && user.name }
        </p>
        { 
          profile !== null
            ? 'has'
            : <>
                <p>No profile set yet! <b>Create Now</b></p>
                <Link to="/create-profile" className="btn btn-primary my-1">
                  Create Profile
                </Link> 
              </>
        }
      </>
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
})

export default connect( mapStateToProps, { getCurrentProfile } )(Dashboard)
