import React from 'react'
import wide_logo from '../assets/images/wide_logo.png';
import YouTubePlayer from './YoutubePlayer';

function LoginView() {
    return (
        <>
            <div className='fullScreenView'>
                <div className='loginViewContainer'>
                    <div className='loginView'>
                        <img src={wide_logo} style={{ height: '140px' }}></img>
                        <div className='signInOptions'>
                            <h2 className='signInOptionsHeading'>Login Options</h2>
                            <div id='signInDiv'></div>
                        </div>
                    </div>
                    <div className='videoView'>
                        <YouTubePlayer videoId={'uYEbB4pE9Kg'} />
                    </div>
                </div>
            </div>
            <div className='fullScreenFooter'>
                <a className='footerSpan'>Item A</a>
                <a className='footerSpan'>Item B</a>
                <a className='footerSpan'>Item C</a>
                <a className='footerSpan'>Item D</a>
                <a className='footerSpan'>Item F</a>
            </div>
        </>
    )
}

export default LoginView
