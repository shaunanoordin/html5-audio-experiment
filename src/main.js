const KEYS = 'qasdfghj'.split('')

const MUSIC_NOTES_CONFIG = [
  {
    keyboardKey: 'a',
    frequency: 261.63,  // C note, on C major scale
  },
  {
    keyboardKey: 's',
    frequency: 293.66,  // D note
  },
  {
    keyboardKey: 'd',
    frequency: 329.63,  // E note
  },
  {
    keyboardKey: 'f',
    frequency: 349.23,  // F note
  },
  {
    keyboardKey: 'g',
    frequency: 392,  // G note
  },
  {
    keyboardKey: 'h',
    frequency: 440,  // A note
  },
  {
    keyboardKey: 'j',
    frequency: 493.88,  // B note
  },
]

const SFX_CONFIG = [
  {
    keyboardKey: 'q',
    name: 'splash',
  },
]

/*
Primary App Class
 */
class App {
  constructor() {
    console.log('HTML5 Audio Experiment is booting up')
    
    // General app properties
    this.audioContext = undefined
    this.audioData = undefined

    // Bind functions to self
    this.app_onKeyUp = this.app_onKeyUp.bind(this)
    this.musicNotes_onClick = this.musicNotes_onClick.bind(this)
    this.sfxButton_onClick = this.sfxButton_onClick.bind(this)
    this.startButton_onClick = this.startButton_onClick.bind(this)
    
    // Setup initial UI
    const htmlMain = document.querySelector('main')
    htmlMain.addEventListener('keyup', this.app_onKeyUp)
    htmlMain.focus()
    document.querySelector('#start-button').addEventListener('click', this.startButton_onClick)

    // Only initialise after user input
    this.initialised = false
  }

  /*
  Initialise only after user input.
  AudioContext can't be created until app receives some sort of user input.
   */
  async initAfterUserInput () {
    if (this.initialised) return

    // Remove start button
    // document.querySelector('#start-button').removeEventListener('click', this.startButton_onClick)  // Is this necessary?
    document.querySelector('#start-button').remove()

    // Initiate audio system
    this.audioContext = new AudioContext()
    await this.loadFiles()

    // Cleanup
    this.setupUI()
    this.initialised = true
  }

  setupUI () {
    // Add SFX buttons
    const htmlSFXButtonsContainer = document.querySelector('#sfx-buttons')
    SFX_CONFIG.forEach((sfx) => {
      const htmlLi = document.createElement('li')
      const htmlButton = document.createElement('button')

      htmlButton.innerText = `[${sfx.keyboardKey.toUpperCase()}] ${sfx.name}`
      htmlButton.dataset.keyboardKey = sfx.keyboardKey
      htmlButton.addEventListener('click', this.sfxButton_onClick)

      htmlLi.appendChild(htmlButton)
      htmlSFXButtonsContainer.appendChild(htmlLi)
    })

    // Add musical notes
    const htmlMusicNotesContainer = document.querySelector('#music-notes')

    MUSIC_NOTES_CONFIG.forEach((musicNote) => {
      const htmlLi = document.createElement('li')
      const htmlButton = document.createElement('button')

      htmlButton.innerText = `[${musicNote.keyboardKey.toUpperCase()}]`
      htmlButton.dataset.keyboardKey = musicNote.keyboardKey
      htmlButton.addEventListener('click', this.musicNotes_onClick)

      htmlLi.appendChild(htmlButton)
      htmlMusicNotesContainer.appendChild(htmlLi)
    })
  }

  async loadFiles () {
    this.audioData = {
      splash: await this.fetchAudioData('assets/bbc-splash.wav'),
    }
  }

  async fetchAudioData (filepath) {
    const res = await fetch(filepath)
    const arrayBuffer = await res.arrayBuffer()
    const audioData = await this.audioContext.decodeAudioData(arrayBuffer)
    return audioData
  }

  app_onKeyUp (e) {
    if (!this.initialised) {
      if (e.key === 'Enter' || e.key === ' ') this.initAfterUserInput()
      return
    }


    const key = e.key.toLowerCase()
    if (KEYS.includes(key)) this.playKey(key)
  }

  musicNotes_onClick (e) {
    this.playKey(e.target.dataset.keyboardKey)
  }

  sfxButton_onClick (e) {
    this.playKey(e.target.dataset.keyboardKey)
  }

  startButton_onClick (e) {
    this.initAfterUserInput()
  }

  playKey (keyboardKey) {
    console.log('Play Key: ', keyboardKey)

    MUSIC_NOTES_CONFIG.forEach((musicNote) => {
      if (musicNote.keyboardKey === keyboardKey) {
        this.playSoundFromCode(musicNote.frequency)
      }
    })

    SFX_CONFIG.forEach((sfx) => {
      if (sfx.keyboardKey === keyboardKey) {
        this.playSoundFromAudioData(sfx.name)
      }
    })
  }

  /*
  Play an instance of a sound from registered audio data.
  For every instance of a sound, create a new AudioBufferSourceNode.
  Each AudioBufferSourceNode can only have .start() called once.
   */
  playSoundFromAudioData (name) {
    if (!name || !this.audioData?.[name]) {
      console.error('Can\'t find audio data for ', name)
      return
    }

    const audioContext = this.audioContext
    const audioSource = audioContext.createBufferSource()
    audioSource.buffer = this.audioData[name]
    audioSource.connect(audioContext.destination)
    audioSource.start()
  }

  /*
  Play an instance of a basic sound like a beep or a boop.
  For every 
   */
  playSoundFromCode (frequencyHz = 440, type = 'sine', duration = 0.1) {
    const audioContext = this.audioContext
    const oscillator = audioContext.createOscillator()
    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequencyHz, audioContext.currentTime)
    oscillator.connect(audioContext.destination)
    oscillator.start()  // Optional: oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration)
  }
}

/*
Initialise!
 */
window.onload = function() {
  window.app = new App()
}
