const Button = (props) => {
  const img = `/img/${props.choice.img}`
  const txt = props.choice.txt
  const onClick = props.onClick
  const percent = props.percent
  const voted = props.voted

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
        {voted ? percent : ''}
      </div>
      {txt.toUpperCase()}
    </div>
  )
}

export default Button