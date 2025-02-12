const KEYS = 'qwerty'.split('')

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
    document.querySelector('#start-button').removeEventListener('click', this.startButton_onClick)
    document.querySelector('#start-button').remove()

    //
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
    this.audioData = await this.fetchAudioData('assets/bbc-splash.wav')
  }

  async fetchAudioData (filepath) {
    const res = await fetch(filepath)
    const arrayBuffer = await res.arrayBuffer()
    const audioData = await this.audioContext.decodeAudioData(arrayBuffer)
    return audioData
  }

  app_onKeyUp (e) {
    if (!this.initialised && e.key === 'Enter') {
      this.initAfterUserInput()
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
  }
}

/*
Initialise!
 */
window.onload = function() {
  window.app = new App()
}
