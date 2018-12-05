const mainText = document.querySelector('#main-text')
const mainImg = document.querySelector('#main-pic')
const submitButton = document.querySelector('#submit-btn')
const input = document.querySelector('#input-text')

let slides = []
let currentSlide = 0


submitButton.addEventListener('click', () => {
  try {
    slides = JSON.parse(input.value)
  } catch (err) {
    console.log(err)
  }
})

document.onkeydown = (event) => {
  if (event.keyCode === 37) previous()
  if (event.keyCode === 39) next()
}

function changeSlide () {
  console.log(currentSlide)
  mainText.innerText = slides[currentSlide].text
  mainImg.src = slides[currentSlide].img
}

function previous () {
  if (currentSlide === 0) return
  currentSlide--
  changeSlide()
}

function next () {
  if (currentSlide === slides.length - 1) return
  currentSlide++
  changeSlide()
}