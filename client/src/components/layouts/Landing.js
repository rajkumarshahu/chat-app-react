import React, { Component } from 'react'
import {Link} from 'react-router-dom';

class Landing extends Component {
  render() {
    return (
        <div className="landing">
    <div className="dark-overlay landing-inner text-light">
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center">
            <h1 className="display-3 mb-4">Chat to Connect</h1>
         
            <p className="lead"> {' '}
            
            Connect with friends and family. Make a new friend.</p>
            <hr />
            <Link to="/register" className="btn btn-lg btn-info mr-2">Sign Up</Link>
            <Link to="/login" className="btn btn-lg btn-light">Login</Link>
            <hr />
            <span className="bg-dark h3">or</span>
            <hr />
            <div>
            <Link to="/guest" className="btn btn-lg btn-secondary">Enter as a Guest</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    )
  }
}

export default Landing;