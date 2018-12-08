const prepDiv = document.querySelector('#prep')
const presDiv = document.querySelector('#pres')
const mainText = document.querySelector('#main-text')
const mainImg = document.querySelector('#main-pic')
const submitButton = document.querySelector('#submit-btn')
const slidesInput = document.querySelector('#input-text')
const joinButton = document.querySelector('#join-btn')
const sessionInput = document.querySelector('#input-session')
const sessionId = document.querySelector('#session-id')
const reactionPoop = document.querySelector('#reaction-poop')
const reactionStar = document.querySelector('#reaction-star')
const reactionMh = document.querySelector('#reaction-mh')
const reactionAngry = document.querySelector('#reaction-angry')
  
const socket = new WebSocket('wss://cnrd.computer/knowbase-ws')

socket.onopen = event => {
  checkParams()
}

socket.addEventListener('message', event => {
  const msg = JSON.parse(event.data)

  if (msg.id === state.id) {
    if (msg.do === 'previous') previous()
    if (msg.do === 'next') next()
    if (msg.do === 'send_state') sendState()
    if (msg.do === 'set_state') setState(msg.state)
    if (msg.do === 'reaction') setReaction(msg.emoji)
  }
})

let state = {
  slides: [],
  current_slide: 0,
  mode: 'prep',
  id: false
}

submitButton.addEventListener('click', () => {
  try {
    state.slides = JSON.parse(slidesInput.value)
    present()
  } catch (err) {
    slidesInput.className = 'invalid'

    setTimeout(() => {
      slidesInput.className = ''
    }, 400)
  }
})

joinButton.addEventListener('click', () => {
  state.id = sessionInput.value
  sessionId.innerText = state.id

  requestState()

  sessionInput.className = 'invalid'

  setTimeout(() => {
    sessionInput.className = ''
  }, 400)
})

reactionPoop.addEventListener('click', () => {
  sendReaction('poop')
})

reactionStar.addEventListener('click', () => {
  sendReaction('star')
})

reactionMh.addEventListener('click', () => {
  sendReaction('mh')
})

reactionAngry.addEventListener('click', () => {
  sendReaction('angry')
})

sessionId.addEventListener('click', () => {
  const url = new URL(window.location)
  const text = `${ url.origin }${ url.pathname }?id=${ state.id }`

  navigator.clipboard.writeText(text)
})

document.onkeydown = (event) => {
  if (state.mode === 'pres') {
    if (event.keyCode === 37) {
      const msg = {
        id: state.id,
        do: 'previous'
      }

      socket.send(JSON.stringify(msg))
      previous()
    }

    if (event.keyCode === 39) {
      const msg = {
        id: state.id,
        do: 'next'
      }

      socket.send(JSON.stringify(msg))
      next()
    }

    if (event.keyCode === 38) {
      prepare()
    }
  }
}

function checkParams () {
  const url = new URL(window.location)
  const id = url.searchParams.get('id')
  
  if (id) {
    state.id = id
    sessionId.innerText = state.id

    const url = new URL(window.location)
    window.history.pushState('knowbase', 'knowbase', url.pathname)

    requestState()
  }
}

function setReaction (emoji) {
  console.log(emoji)

  if (emoji === 'poop') {
    const clone = reactionPoop.cloneNode(true)
    const parent = reactionPoop.parentNode
    parent.appendChild(clone)
    clone.className = 'reaction'

    setTimeout(() => {
      clone.remove()
    }, 1000)
  }

  if (emoji === 'star') {
    const clone = reactionStar.cloneNode(true)
    const parent = reactionStar.parentNode
    parent.appendChild(clone)
    clone.className = 'reaction'

    setTimeout(() => {
      clone.remove()
    }, 1000)
  }

  if (emoji === 'mh') {
    const clone = reactionMh.cloneNode(true)
    const parent = reactionMh.parentNode
    parent.appendChild(clone)
    clone.className = 'reaction'

    setTimeout(() => {
      clone.remove()
    }, 1000)
  }

  if (emoji === 'angry') {
    const clone = reactionAngry.cloneNode(true)
    const parent = reactionAngry.parentNode
    parent.appendChild(clone)
    clone.className = 'reaction'

    setTimeout(() => {
      clone.remove()
    }, 1000)
  }
}

function sendReaction (emoji) {
  const msg = { 
    id: state.id,
    do: 'reaction',
    emoji: emoji
  }

  socket.send(JSON.stringify(msg))
}

function setState (sessionState) {
  state = sessionState
  console.log(state)

  present()
  changeSlide()
}

function sendState () {
  const msg = { 
    id: state.id,
    do: 'set_state',
    state: state
  }

  socket.send(JSON.stringify(msg))
}

function requestState () {
  const msg = { 
    id: state.id,
    do: 'send_state'
  }

  socket.send(JSON.stringify(msg))
}

function generateId () {
  state.id = `${ Math.random().toString(24).replace(/[^a-z]+/g, '').substr(0, 5).toUpperCase() }-${ Math.floor(Math.random() * (999 - 111) + 111) }`
  sessionId.innerText = state.id
}

function prepare () {
  state.mode = 'prep'
  state.current_slide = 0
  state.id = false
  
  prepDiv.style.display = 'block'
  presDiv.style.display = 'none'
}

function present () {
  state.mode = 'pres'
  if (!state.id) generateId()

  prepDiv.style.display = 'none'
  presDiv.style.display = 'flex'

  changeSlide()
}

function changeSlide () {
  if (state.slides[state.current_slide].text) {
    mainText.style.display = 'block'
    mainImg.style.display = 'none'

    mainText.innerText = state.slides[state.current_slide].text
  } else if (state.slides[state.current_slide].img) {
    mainImg.style.display = 'block'
    mainText.style.display = 'none'

    mainImg.src = state.slides[state.current_slide].img
  } else {
    console.log('no valid slide')
  }

  console.log(state.current_slide)
}

function previous () {
  if (state.current_slide === 0) return

  state.current_slide--
  changeSlide()
}

function next () {
  if (state.current_slide === state.slides.length - 1) return

  state.current_slide++
  changeSlide()
}