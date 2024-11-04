function Fallback({error}) {

  return (
    <div>
      <span>{'An error has occurred: ' + error.message}</span>
    </div>
  )
}

export default Fallback
