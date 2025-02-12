const KEYS = 'qasdfghj'.split('')

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
    this.musicKey_onClick = this.musicKey_onClick.bind(this)
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
    const htmlMusicKeysContainer = document.querySelector('#music-keys')

    for (let i = 0 ; i < KEYS.length ; i++) {
      const charKey = KEYS[i]
      const htmlLi = document.createElement('li')
      const htmlButton = document.createElement('button')

      htmlButton.innerText = charKey.toUpperCase()
      htmlButton.dataset.char = charKey
      htmlButton.addEventListener('click', this.musicKey_onClick)

      htmlLi.appendChild(htmlButton)
      htmlMusicKeysContainer.appendChild(htmlLi)
    }
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

  musicKey_onClick (e) {
    this.playKey(e.target.dataset.char)
  }

  startButton_onClick (e) {
    this.initAfterUserInput()
  }

  playKey (char) {
    console.log('Play Key: ', char)

    switch (char) {
      case 'q':
        this.playSoundFromAudioData('splash')
        break
      case 'a':
        this.playSoundFromCode(261.63)  // C
        break
      case 's':
        this.playSoundFromCode(293.66)  // D
        break
      case 'd':
        this.playSoundFromCode(329.63)  // E
        break
      case 'f':
        this.playSoundFromCode(349.23)  // F
        break
      case 'g':
        this.playSoundFromCode(392)  // G
        break
      case 'h':
        this.playSoundFromCode(440)  // A
        break
      case 'j':
        this.playSoundFromCode(493.88)  // B
        break      
    }
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
