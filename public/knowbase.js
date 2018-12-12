const socket = new WebSocket('wss://cnrd.computer/knowbase-ws')

const app = new Vue({
  el: '#app',
  data: {
    app: {
      name: 'knowbase',
      version: '0.1'
    },
    state: {
      id: false,
      mode: 'prep',
      slides: [],
      currentSlide: {
        pos: 0,
        data: {
          txt: null,
          img: null
        }
      },
      viewer: 0
    },
    input: {
      slides: '[{ "txt": "Hello slide one" }, { "img": "https://myhero.com/images/guest/g285052/hero107070/Young-Bill-Gates.jpg" }, { "txt": "Hello slide three" }]',
      session: ''
    },
    slidesInvalid: false,
    sessionInvalid: false
  },
  created: function () {
    socket.onopen = event => {
      this.checkParams()
    }
    
    socket.addEventListener('message', event => {
      const msg = JSON.parse(event.data)
    
      if (msg.id === this.state.id) {
        if (msg.do === 'previous') this.previous()
        if (msg.do === 'next') this.next()
        if (msg.do === 'send_state') this.sendState()
        if (msg.do === 'set_state') this.setState(msg.state)
        if (msg.do === 'reaction') this.setReaction(msg.emoji)
        if (msg.do === 'set_viewer') this.setViewer(msg.viewer)
      }
    })

    document.onkeydown = (event) => {
      if (this.state.mode === 'pres') {
        if (event.keyCode === 37) {
          const msg = {
            id: this.state.id,
            do: 'previous'
          }
    
          socket.send(JSON.stringify(msg))
          this.previous()
        }
    
        if (event.keyCode === 39) {
          const msg = {
            id: this.state.id,
            do: 'next'
          }
    
          socket.send(JSON.stringify(msg))
          this.next()
        }
    
        if (event.keyCode === 38 || event.keyCode === 27) {
          this.prepare()
        }
      }
    }
  },
  computed: {
    isPresenting: function () {
      if (this.state.mode === 'pres') return true
    }
  },
  methods: {
    next: function () {
      if (this.state.currentSlide.pos === this.state.slides.length - 1) return

      this.state.currentSlide.pos++
      this.state.currentSlide.data = this.state.slides[this.state.currentSlide.pos]
    },
    previous: function () {
      if (this.state.currentSlide.pos === 0) return

      this.state.currentSlide.pos--
      this.state.currentSlide.data = this.state.slides[this.state.currentSlide.pos]
    },
    checkParams: function () {
      const url = new URL(window.location)
      const id = url.searchParams.get('id')
      
      if (id) {
        this.state.id = id
    
        const url = new URL(window.location)
        window.history.pushState('knowbase', 'knowbase', url.pathname)
    
        this.requestState()
      }
    },
    copyIdToClipboard: function () {
      const url = new URL(window.location)
      const text = `${ url.origin }${ url.pathname }?id=${ this.state.id }`
    
      navigator.clipboard.writeText(text)
    },
    generateId: function () {
      this.state.id = `${ Math.random().toString(24).replace(/[^a-z]+/g, '').substr(0, 5).toUpperCase() }-${ Math.floor(Math.random() * (999 - 111) + 111) }`
    },
    setViewer: function (viewer) {
      this.state.viewer = viewer
    },
    requestViewer: function () {
      this.state.viewer++
      
      const msg = { 
        id: this.state.id,
        do: 'send_viewer'
      }
    
      socket.send(JSON.stringify(msg))
    },
    setReaction: function (emoji) {
      if (emoji === 'poop') {
        const clone = this.$refs.poop.cloneNode(true)
        const parent = this.$refs.poop.parentNode
        parent.appendChild(clone)
        clone.className = 'reaction'
    
        setTimeout(() => {
          clone.remove()
        }, 1000)
      }
    
      if (emoji === 'star') {
        const clone = this.$refs.star.cloneNode(true)
        const parent = this.$refs.star.parentNode
        parent.appendChild(clone)
        clone.className = 'reaction'
    
        setTimeout(() => {
          clone.remove()
        }, 1000)
      }
    
      if (emoji === 'mh') {
        const clone = this.$refs.mh.cloneNode(true)
        const parent = this.$refs.mh.parentNode
        parent.appendChild(clone)
        clone.className = 'reaction'
    
        setTimeout(() => {
          clone.remove()
        }, 1000)
      }
    
      if (emoji === 'angry') {
        const clone = this.$refs.angry.cloneNode(true)
        const parent = this.$refs.angry.parentNode
        parent.appendChild(clone)
        clone.className = 'reaction'
    
        setTimeout(() => {
          clone.remove()
        }, 1000)
      }
    },
    sendReaction: function (emoji) {
      const msg = { 
        id: this.state.id,
        do: 'reaction',
        emoji: emoji
      }
    
      socket.send(JSON.stringify(msg))
    },
    setState: function (sessionState) {
      this.state = sessionState
      this.present()
      console.log(this.state)
    },
    sendState: function () {
      const msg = { 
        id: this.state.id,
        do: 'set_state',
        state: this.state
      }

      this.requestViewer()
      socket.send(JSON.stringify(msg))
    },
    requestState: function () {
      const msg = { 
        id: this.state.id,
        do: 'send_state'
      }
    
      socket.send(JSON.stringify(msg))
    },
    sendReaction: function (emoji) {
      const msg = { 
        id: this.state.id,
        do: 'reaction',
        emoji: emoji
      }

      socket.send(JSON.stringify(msg))
    },
    present: function () {
      this.state.mode = 'pres'
      if (!this.state.id) this.generateId()
    
      this.state.currentSlide.data = this.state.slides[this.state.currentSlide.pos]
    },
    prepare: function () {
      this.state.mode = 'prep'
      this.state.currentSlide.pos = 0
      this.state.id = false
    },
    submitClicked: function () {
      try {
        this.state.slides = JSON.parse(this.input.slides)
        this.present()
      } catch (err) {
        this.slidesInvalid = true
    
        setTimeout(() => {
          this.slidesInvalid = false
        }, 400)
      }
    },
    joinClicked: function () {
      this.state.id = this.input.session
    
      this.requestState()
    
      this.sessionInvalid = true
    
      setTimeout(() => {
        this.sessionInvalid = false
      }, 400)
    }
  }
})
