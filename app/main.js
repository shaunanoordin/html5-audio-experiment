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

eval("const KEYS = 'qwerty'.split('');\n\n/*\nPrimary App Class\n */\nclass App {\n  constructor() {\n    console.log('HTML5 Audio Experiment is booting up');\n\n    // General app properties\n    this.audioContext = undefined;\n    this.audioData = undefined;\n\n    // Bind functions to self\n    this.app_onKeyUp = this.app_onKeyUp.bind(this);\n    this.musicKey_onClick = this.musicKey_onClick.bind(this);\n    this.startButton_onClick = this.startButton_onClick.bind(this);\n\n    // Setup initial UI\n    const htmlMain = document.querySelector('main');\n    htmlMain.addEventListener('keyup', this.app_onKeyUp);\n    htmlMain.focus();\n    document.querySelector('#start-button').addEventListener('click', this.startButton_onClick);\n\n    // Only initialise after user input\n    this.initialised = false;\n  }\n\n  /*\n  Initialise only after user input.\n  AudioContext can't be created until app receives some sort of user input.\n   */\n  async initAfterUserInput() {\n    if (this.initialised) return;\n\n    // Remove start button\n    // document.querySelector('#start-button').removeEventListener('click', this.startButton_onClick)  // Is this necessary?\n    document.querySelector('#start-button').remove();\n\n    // Initiate audio system\n    this.audioContext = new AudioContext();\n    await this.loadFiles();\n\n    // Cleanup\n    this.setupUI();\n    this.initialised = true;\n  }\n  setupUI() {\n    const htmlMusicKeysContainer = document.querySelector('#music-keys');\n    for (let i = 0; i < KEYS.length; i++) {\n      const charKey = KEYS[i];\n      const htmlLi = document.createElement('li');\n      const htmlButton = document.createElement('button');\n      htmlButton.innerText = charKey.toUpperCase();\n      htmlButton.dataset.char = charKey;\n      htmlButton.addEventListener('click', this.musicKey_onClick);\n      htmlLi.appendChild(htmlButton);\n      htmlMusicKeysContainer.appendChild(htmlLi);\n    }\n  }\n  async loadFiles() {\n    this.audioData = await this.fetchAudioData('assets/bbc-splash.wav');\n  }\n  async fetchAudioData(filepath) {\n    const res = await fetch(filepath);\n    const arrayBuffer = await res.arrayBuffer();\n    const audioData = await this.audioContext.decodeAudioData(arrayBuffer);\n    return audioData;\n  }\n  app_onKeyUp(e) {\n    if (!this.initialised && (e.key === 'Enter' || e.key === ' ')) {\n      this.initAfterUserInput();\n      return;\n    }\n    const key = e.key.toLowerCase();\n    if (KEYS.includes(key)) this.playKey(key);\n  }\n  musicKey_onClick(e) {\n    this.playKey(e.target.dataset.char);\n  }\n  startButton_onClick(e) {\n    this.initAfterUserInput();\n  }\n  playKey(char) {\n    const audioContext = this.audioContext;\n    console.log('Play Key: ', char);\n    switch (char) {\n      case 'q':\n        const audioSource = audioContext.createBufferSource();\n        audioSource.buffer = this.audioData;\n        audioSource.connect(audioContext.destination);\n        audioSource.start();\n        break;\n    }\n  }\n}\n\n/*\nInitialise!\n */\nwindow.onload = function () {\n  window.app = new App();\n};\n\n//# sourceURL=webpack://html5-audio-experiment/./src/main.js?");

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