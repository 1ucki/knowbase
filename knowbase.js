const prepDiv = document.querySelector('#prep')
const presDiv = document.querySelector('#pres')
const mainText = document.querySelector('#main-text')
const mainImg = document.querySelector('#main-pic')
const submitButton = document.querySelector('#submit-btn')
const input = document.querySelector('#input-text')

let slides = []
let state = {
  current_slide: 0,
  mode: 'prep'
}

submitButton.addEventListener('click', () => {
  try {
    slides = JSON.parse(input.value)
    present()
  } catch (err) {
    input.className = 'invalid'

    setTimeout(() => {
      input.className = ''
    }, 400)
  }
})

document.onkeydown = (event) => {
  if (state.mode === 'pres') {
    if (event.keyCode === 37) previous()
    if (event.keyCode === 39) next()
    if (event.keyCode === 38) prepare()
  }
}

function prepare () {
  state.mode = 'prep'
  state.current_slide = 0
  
  prepDiv.style.display = 'block'
  presDiv.style.display = 'none'
}

function present () {
  state.mode = 'pres'

  prepDiv.style.display = 'none'
  presDiv.style.display = 'flex'

  changeSlide()
}

function changeSlide () {
  mainText.innerText = slides[state.current_slide].text
  mainImg.src = slides[state.current_slide].img

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