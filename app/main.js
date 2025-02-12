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

eval("const KEYS = 'qwerty'.split('');\n\n/*\nPrimary App Class\n */\nclass App {\n  constructor() {\n    console.log('HTML5 Audio Experiment is ready');\n    this.musicKeys = [];\n    this.musicKey_onClick = this.musicKey_onClick.bind(this);\n    this.app_onKeyUp = this.app_onKeyUp.bind(this);\n    this.setupUI();\n  }\n  setupUI() {\n    const htmlMain = document.querySelector('main');\n    htmlMain.addEventListener('keyup', this.app_onKeyUp);\n    const htmlMusicKeysContainer = document.querySelector('#music-keys');\n    for (let i = 0; i < KEYS.length; i++) {\n      const charKey = KEYS[i];\n      const htmlLi = document.createElement('li');\n      const htmlButton = document.createElement('button');\n      htmlButton.innerText = charKey.toUpperCase();\n      htmlButton.dataset.char = charKey;\n      htmlButton.addEventListener('click', this.musicKey_onClick);\n      htmlLi.appendChild(htmlButton);\n      htmlMusicKeysContainer.appendChild(htmlLi);\n    }\n    htmlMain.focus();\n  }\n  app_onKeyUp(e) {\n    const key = e.key.toLowerCase();\n    if (KEYS.includes(key)) this.playKey(key);\n  }\n  musicKey_onClick(e) {\n    this.playKey(e.target.dataset.char);\n  }\n  playKey(char) {\n    console.log('Play Key: ', char);\n  }\n}\n\n/*\nInitialise!\n */\nwindow.onload = function () {\n  window.app = new App();\n};\n\n//# sourceURL=webpack://html5-audio-experiment/./src/main.js?");

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