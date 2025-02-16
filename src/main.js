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

    // Actively playing sounds
    this.activeMusicNotes = new Map()

    // Bind functions to self
    this.app_onKeyDown = this.app_onKeyDown.bind(this)
    this.app_onKeyUp = this.app_onKeyUp.bind(this)
    this.musicNotes_onClick = this.musicNotes_onClick.bind(this)
    this.sfxButton_onClick = this.sfxButton_onClick.bind(this)
    this.startButton_onClick = this.startButton_onClick.bind(this)
    
    // Setup initial UI
    const htmlMain = document.querySelector('main')
    htmlMain.addEventListener('keydown', this.app_onKeyDown)
    htmlMain.addEventListener('keyup', this.app_onKeyUp)
    document.querySelector('#start-button').addEventListener('click', this.startButton_onClick)
    document.querySelector('#start-button').focus()
    
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
    document.querySelector('main').focus()
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

  app_onKeyDown (e) {
    if (!this.initialised) return
    const keyboardKey = e.key.toLowerCase()

    if (MUSIC_NOTES_CONFIG.find(mn => mn.keyboardKey === keyboardKey)) {
      this.startPlayingMusicNote(keyboardKey)
    }
  }

  app_onKeyUp (e) {
    if (!this.initialised) return
    const keyboardKey = e.key.toLowerCase()

    if (MUSIC_NOTES_CONFIG.find(mn => mn.keyboardKey === keyboardKey)) {
      this.stopPlayingMusicNote(keyboardKey)
    }

    SFX_CONFIG.forEach((sfx) => {
      if (sfx.keyboardKey === keyboardKey) {
        this.playSoundFromAudioData(sfx.name)
      }
    })
  }

  musicNotes_onClick (e) {
    const keyboardKey = e.target.dataset.keyboardKey
    MUSIC_NOTES_CONFIG.forEach((musicNote) => {
      if (musicNote.keyboardKey === keyboardKey) {
        this.playSoundFromCode(musicNote.frequency)
      }
    })
  }

  sfxButton_onClick (e) {
    const keyboardKey = e.target.dataset.keyboardKey
    SFX_CONFIG.forEach((sfx) => {
      if (sfx.keyboardKey === keyboardKey) {
        this.playSoundFromAudioData(sfx.name)
      }
    })
  }

  startButton_onClick (e) {
    this.initAfterUserInput()
  }

  /*
  Play an instance of a sound from registered audio data.
  For every instance of a sound, create a new AudioBufferSourceNode.
  Each AudioBufferSourceNode can only have .start() called once.
   */
  playSoundFromAudioData (name) {
    if (!this.initialised) return
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
   */
  playSoundFromCode (frequencyHz = 440, type = 'sine', duration = 0.2, fadeOutDuration = 0.1) {
    if (!this.initialised) return
    const audioContext = this.audioContext
    const t = audioContext.currentTime

    // Create the sound maker
    const oscillator = audioContext.createOscillator()
    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequencyHz, t)

    // Use the Gain node to slowly increase, then taper off the sound.
    // If we didn't do this, we'd sometimes her clicking sounds.
    const gainNode = audioContext.createGain()
    gainNode.gain.setValueAtTime(0, t)
    gainNode.gain.linearRampToValueAtTime(1, t + (duration - fadeOutDuration))
    // TODO: implement separate fadeInDuration
    gainNode.gain.linearRampToValueAtTime(0, t + duration)

    // Connect the audio nodes together, and then play
    oscillator.connect(gainNode).connect(audioContext.destination)
    oscillator.start()  // Optional: oscillator.start(audioContext.currentTime)
    oscillator.stop(t + duration)
  }

  /*
  Start playing an instance of a basic sound like a beep or a boop, but don't
  stop until stopPlayingMusicNote() is called.
  A more advanced version of playSoundFromCode().
   */
  startPlayingMusicNote (keyboardKey) {
    if (!this.initialised || !keyboardKey) return
    if (this.activeMusicNotes.has(keyboardKey)) return  // Sound is already playing

    // Get sound details
    const musicNote = MUSIC_NOTES_CONFIG.find(mn => mn.keyboardKey === keyboardKey)
    if (!musicNote) return

    // Audio setup
    const audioContext = this.audioContext
    const t = audioContext.currentTime
    const fadeInDuration = 0.05
    const type = 'sine'
    const frequencyHz = musicNote.frequency

    // Create the sound maker
    const oscillator = audioContext.createOscillator()
    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequencyHz, t)

    // Use the Gain node to slowly increase sound.
    // If we didn't do this, we'd sometimes her clicking sounds.
    const gainNode = audioContext.createGain()
    gainNode.gain.setValueAtTime(0, t)
    gainNode.gain.linearRampToValueAtTime(1, t + fadeInDuration)

    // Connect the audio nodes together, and then play
    oscillator.connect(gainNode).connect(audioContext.destination)
    oscillator.start()  // Optional: oscillator.start(audioContext.currentTime)
    // oscillator.stop(t + duration)

    // Register actively playing sound
    this.activeMusicNotes.set(keyboardKey, {
      oscillator: oscillator,
      gainNode: gainNode,
    })
  }

  /*
  Stops playing a sound.
   */
  stopPlayingMusicNote (keyboardKey) {
    if (!this.initialised || !keyboardKey) return
    
    // Get sound details
    const musicNote = this.activeMusicNotes.get(keyboardKey)
    if (!musicNote) return

    // Audio setup
    const audioContext = this.audioContext
    const t = audioContext.currentTime
    const fadeOutDuration = 0.05

    // Stop the sound.
    // Use the Gain node to slowly taper off the sound.
    // If we didn't do this, we'd sometimes her clicking sounds.
    musicNote.gainNode.gain.setValueAtTime(1, t)
    musicNote.gainNode.gain.linearRampToValueAtTime(0, t + fadeOutDuration)
    musicNote.oscillator.stop(t + fadeOutDuration)

    // Unregister actively playing sound
    this.activeMusicNotes.delete(keyboardKey)
  }
}

/*
Initialise!
 */
window.onload = function() {
  window.app = new App()
}
