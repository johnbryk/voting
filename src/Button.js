// useState and useEffect here are used for the button animation
import { useState, useEffect } from 'react'

// our button gets some props from the app
const Button = (props) => {

  // the buttons are now animated to show the percents increasing from 0 to whatever they should be
  // percentGrow represents this increasing value
  const [percentGrow, setPercentGrow] = useState(0)

  // I put the images into a directory called img in public. this becomes a directory called img in
  // build. since our server app redirects url requests that are not handled by our explicit get
  // and post requests, this will get redirected to /build/img/whatever.png
  const img = `/img/${props.choice.img}`
  
  // the rest of this is pretty clear I hope
  const txt = props.choice.txt
  const onClick = props.onClick
  const percent = props.percent
  const voted = props.voted

  // this keeps track of whether the animation continues--if the displayed value is less than the actual value,
  // ... keep growing!
  const keepGrowing = percentGrow < percent.slice(0, percent.length-1)

  // this increments percentGrow--if you voted and percentGrow < pecent, increment percentGrow
  useEffect(() => {
    console.log('happens')
    if(voted && keepGrowing) {
      window.setTimeout(() => { setPercentGrow(percentGrow+1) }, 10)
    }
    // this updates when props.voted changes (this could probably just be voted) and when percentGrow changes
    // this is because we want the animation to start when props.voted changes from false to true
    // and because percentGrow stops changing when it is equal to percent, so this will stop being called
  }, [props.voted, percentGrow])

  return (
    <div>
      {/* the "button" is really a div with the image is background
      I set an inner shadow over the box if the user has voted */}
      <div
        className='button'
        style={{
          backgroundImage: `url(${img})`,
          boxShadow: voted ? 'inset 0 0 0 2000px rgba(50, 50, 50, 0.7)' : 'inset 0 0 0 0px rgba(127, 127, 127, 0)'
        }}
        onClick={onClick}
      >
        {/* if the user voted, show either percentGrow or percent depending on whether percentGrow is still
        growing or not; if the user didn't vote yet, don't show anything */}
        {voted ? (keepGrowing ? percentGrow + "%" : percent) : ''}
      </div>
      {txt.toUpperCase()}
    </div>
  )
}

export default Button
