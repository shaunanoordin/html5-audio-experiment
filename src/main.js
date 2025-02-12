const KEYS = 'qwerty'.split('')

/*
Primary App Class
 */
class App {
  constructor() {
    console.log('HTML5 Audio Experiment is ready')
    this.musicKeys = []

    this.musicKey_onClick = this.musicKey_onClick.bind(this)
    this.app_onKeyUp = this.app_onKeyUp.bind(this)

    this.setupUI()
  }

  setupUI () {
    const htmlMain = document.querySelector('main')
    htmlMain.addEventListener('keyup', this.app_onKeyUp)

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

    htmlMain.focus()
  }

  app_onKeyUp (e) {
    const key = e.key.toLowerCase()
    if (KEYS.includes(key)) this.playKey(key)
  }

  musicKey_onClick (e) {
    this.playKey(e.target.dataset.char)
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
