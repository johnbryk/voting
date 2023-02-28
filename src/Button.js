import { useState, useEffect } from 'react'

const Button = (props) => {

  const [percentGrow, setPercentGrow] = useState(0)

  const img = `/img/${props.choice.img}`
  const txt = props.choice.txt
  const onClick = props.onClick
  const percent = props.percent
  const voted = props.voted

  const keepGrowing = percentGrow < percent.slice(0, percent.length-1)

  useEffect(() => {
    console.log('happens')
    if(voted && keepGrowing) {
      window.setTimeout(() => { setPercentGrow(percentGrow+1) }, 10)
    }
  }, [props.voted, percentGrow])

  return (
    <div>
      <div
        className='button'
        style={{
          backgroundImage: `url(${img})`,
          boxShadow: voted ? 'inset 0 0 0 2000px rgba(50, 50, 50, 0.7)' : 'inset 0 0 0 0px rgba(127, 127, 127, 0)'
        }}
        onClick={onClick}
      >
        {voted ? (keepGrowing ? percentGrow + "%" : percent) : ''}
      </div>
      {txt.toUpperCase()}
    </div>
  )
}

export default Button