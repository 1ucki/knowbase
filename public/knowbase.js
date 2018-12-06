const prepDiv = document.querySelector('#prep')
const presDiv = document.querySelector('#pres')
const mainText = document.querySelector('#main-text')
const mainImg = document.querySelector('#main-pic')
const submitButton = document.querySelector('#submit-btn')
const slidesInput = document.querySelector('#input-text')
const joinButton = document.querySelector('#join-btn')
const sessionInput = document.querySelector('#input-session')
const sessionId = document.querySelector('#session-id')
  
const socket = new WebSocket('ws://192.168.0.234:3001')

socket.addEventListener('message', event => {
  if (event.data === 'previous') previous()
  if (event.data === 'next') next()
})

let slides = []
let state = {
  current_slide: 0,
  mode: 'prep',
  id: 11111
}

submitButton.addEventListener('click', () => {
  try {
    slides = JSON.parse(slidesInput.value)
    present()
  } catch (err) {
    slidesInput.className = 'invalid'

    setTimeout(() => {
      slidesInput.className = ''
    }, 400)
  }
})

joinButton.addEventListener('click', () => {
  try {
    slides = JSON.parse(slidesInput.value)
    present()
  } catch (err) {
    slidesInput.className = 'invalid'

    setTimeout(() => {
      slidesInput.className = ''
    }, 400)
  }
})

document.onkeydown = (event) => {
  if (state.mode === 'pres') {
    if (event.keyCode === 37) {
      socket.send('previous')
      previous()
    }

    if (event.keyCode === 39) {
      socket.send('next')
      next()
    }

    if (event.keyCode === 38) {
      prepare()
    }
  }
}

function generateSessionId () {
  state.id = `${ Math.random().toString(24).replace(/[^a-z]+/g, '').substr(0, 5).toUpperCase() }-${ Math.floor(Math.random() * (999 - 111) + 111) }`
  sessionId.innerText = state.id
}

function prepare () {
  state.mode = 'prep'
  state.current_slide = 0
  
  prepDiv.style.display = 'block'
  presDiv.style.display = 'none'
}

function present () {
  state.mode = 'pres'
  generateSessionId()

  prepDiv.style.display = 'none'
  presDiv.style.display = 'flex'

  changeSlide()
}

function changeSlide () {
  if (slides[state.current_slide].text) {
    mainText.style.display = 'block'
    mainImg.style.display = 'none'

    mainText.innerText = slides[state.current_slide].text
  } else if (slides[state.current_slide].img) {
    mainImg.style.display = 'block'
    mainText.style.display = 'none'

    mainImg.src = slides[state.current_slide].img
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
  if (state.current_slide === slides.length - 1) return

  state.current_slide++
  changeSlide()
}