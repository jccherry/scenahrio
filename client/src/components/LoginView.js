import React from 'react'
import wide_logo from '../assets/images/wide_logo.png';

function LoginView() {
  return (
    <div className='loginView'>
        <img src={wide_logo} style={{height: '140px'}}></img>
        <div className='signInOptions'>
            <h2 className='signInOptionsHeading'>Login Options</h2>
            <div id='signInDiv'></div>
        </div>
    </div>
  )
}

export default LoginView
