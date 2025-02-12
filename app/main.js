/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/***/ (() => {

eval("const KEYS = 'qasdfghj'.split('');\n\n/*\nPrimary App Class\n */\nclass App {\n  constructor() {\n    console.log('HTML5 Audio Experiment is booting up');\n\n    // General app properties\n    this.audioContext = undefined;\n    this.audioData = undefined;\n\n    // Bind functions to self\n    this.app_onKeyUp = this.app_onKeyUp.bind(this);\n    this.musicKey_onClick = this.musicKey_onClick.bind(this);\n    this.startButton_onClick = this.startButton_onClick.bind(this);\n\n    // Setup initial UI\n    const htmlMain = document.querySelector('main');\n    htmlMain.addEventListener('keyup', this.app_onKeyUp);\n    htmlMain.focus();\n    document.querySelector('#start-button').addEventListener('click', this.startButton_onClick);\n\n    // Only initialise after user input\n    this.initialised = false;\n  }\n\n  /*\n  Initialise only after user input.\n  AudioContext can't be created until app receives some sort of user input.\n   */\n  async initAfterUserInput() {\n    if (this.initialised) return;\n\n    // Remove start button\n    // document.querySelector('#start-button').removeEventListener('click', this.startButton_onClick)  // Is this necessary?\n    document.querySelector('#start-button').remove();\n\n    // Initiate audio system\n    this.audioContext = new AudioContext();\n    await this.loadFiles();\n\n    // Cleanup\n    this.setupUI();\n    this.initialised = true;\n  }\n  setupUI() {\n    const htmlMusicKeysContainer = document.querySelector('#music-keys');\n    for (let i = 0; i < KEYS.length; i++) {\n      const charKey = KEYS[i];\n      const htmlLi = document.createElement('li');\n      const htmlButton = document.createElement('button');\n      htmlButton.innerText = charKey.toUpperCase();\n      htmlButton.dataset.char = charKey;\n      htmlButton.addEventListener('click', this.musicKey_onClick);\n      htmlLi.appendChild(htmlButton);\n      htmlMusicKeysContainer.appendChild(htmlLi);\n    }\n  }\n  async loadFiles() {\n    this.audioData = {\n      splash: await this.fetchAudioData('assets/bbc-splash.wav')\n    };\n  }\n  async fetchAudioData(filepath) {\n    const res = await fetch(filepath);\n    const arrayBuffer = await res.arrayBuffer();\n    const audioData = await this.audioContext.decodeAudioData(arrayBuffer);\n    return audioData;\n  }\n  app_onKeyUp(e) {\n    if (!this.initialised) {\n      if (e.key === 'Enter' || e.key === ' ') this.initAfterUserInput();\n      return;\n    }\n    const key = e.key.toLowerCase();\n    if (KEYS.includes(key)) this.playKey(key);\n  }\n  musicKey_onClick(e) {\n    this.playKey(e.target.dataset.char);\n  }\n  startButton_onClick(e) {\n    this.initAfterUserInput();\n  }\n  playKey(char) {\n    console.log('Play Key: ', char);\n    switch (char) {\n      case 'q':\n        this.playSoundFromAudioData('splash');\n        break;\n      case 'a':\n        this.playSoundFromCode(261.63); // C\n        break;\n      case 's':\n        this.playSoundFromCode(293.66); // D\n        break;\n      case 'd':\n        this.playSoundFromCode(329.63); // E\n        break;\n      case 'f':\n        this.playSoundFromCode(349.23); // F\n        break;\n      case 'g':\n        this.playSoundFromCode(392); // G\n        break;\n      case 'h':\n        this.playSoundFromCode(440); // A\n        break;\n      case 'j':\n        this.playSoundFromCode(493.88); // B\n        break;\n    }\n  }\n\n  /*\n  Play an instance of a sound from registered audio data.\n  For every instance of a sound, create a new AudioBufferSourceNode.\n  Each AudioBufferSourceNode can only have .start() called once.\n   */\n  playSoundFromAudioData(name) {\n    if (!name || !this.audioData?.[name]) {\n      console.error('Can\\'t find audio data for ', name);\n      return;\n    }\n    const audioContext = this.audioContext;\n    const audioSource = audioContext.createBufferSource();\n    audioSource.buffer = this.audioData[name];\n    audioSource.connect(audioContext.destination);\n    audioSource.start();\n  }\n\n  /*\n  Play an instance of a basic sound like a beep or a boop.\n  For every \n   */\n  playSoundFromCode(frequencyHz = 440, type = 'sine', duration = 0.1) {\n    const audioContext = this.audioContext;\n    const oscillator = audioContext.createOscillator();\n    oscillator.type = type;\n    oscillator.frequency.setValueAtTime(frequencyHz, audioContext.currentTime);\n    oscillator.connect(audioContext.destination);\n    oscillator.start(); // Optional: oscillator.start(audioContext.currentTime)\n    oscillator.stop(audioContext.currentTime + duration);\n  }\n}\n\n/*\nInitialise!\n */\nwindow.onload = function () {\n  window.app = new App();\n};\n\n//# sourceURL=webpack://html5-audio-experiment/./src/main.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/main.js"]();
/******/ 	
/******/ })()
;