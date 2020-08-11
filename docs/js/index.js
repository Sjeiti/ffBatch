/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/index.js":
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, exports) {

throw new Error("Module build failed (from ./node_modules/babel-loader/lib/index.js):\nSyntaxError: C:\\Users\\micro\\projects\\ffBatch\\src\\js\\index.js: Support for the experimental syntax 'jsx' isn't currently enabled (12:17):\n\n\u001b[0m \u001b[90m 10 | \u001b[39m\u001b[36mimport\u001b[39m {getCloud} from \u001b[32m'./service/cloud'\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 11 | \u001b[39m\u001b[0m\n\u001b[0m\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 12 | \u001b[39m\u001b[33mReactDOM\u001b[39m\u001b[33m.\u001b[39mrender(\u001b[33m<\u001b[39m\u001b[33mApp\u001b[39m store\u001b[33m=\u001b[39m{store} \u001b[33m/\u001b[39m\u001b[33m>\u001b[39m\u001b[33m,\u001b[39m document\u001b[33m.\u001b[39mgetElementById(\u001b[32m'app'\u001b[39m))\u001b[0m\n\u001b[0m \u001b[90m    | \u001b[39m                \u001b[31m\u001b[1m^\u001b[22m\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 13 | \u001b[39mgetCloud()\u001b[0m\n\u001b[0m \u001b[90m 14 | \u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 15 | \u001b[39m\u001b[90m/**\u001b[39m\u001b[0m\n\nAdd @babel/preset-react (https://git.io/JfeDR) to the 'presets' section of your Babel config to enable transformation.\nIf you want to leave it as-is, add @babel/plugin-syntax-jsx (https://git.io/vb4yA) to the 'plugins' section to enable parsing.\n    at Parser._raise (C:\\Users\\micro\\projects\\ffBatch\\node_modules\\@babel\\parser\\lib\\index.js:763:17)\n    at Parser.raiseWithData (C:\\Users\\micro\\projects\\ffBatch\\node_modules\\@babel\\parser\\lib\\index.js:756:17)\n    at Parser.expectOnePlugin (C:\\Users\\micro\\projects\\ffBatch\\node_modules\\@babel\\parser\\lib\\index.js:8945:18)\n    at Parser.parseExprAtom (C:\\Users\\micro\\projects\\ffBatch\\node_modules\\@babel\\parser\\lib\\index.js:10224:22)\n    at Parser.parseExprSubscripts (C:\\Users\\micro\\projects\\ffBatch\\node_modules\\@babel\\parser\\lib\\index.js:9792:23)\n    at Parser.parseUpdate (C:\\Users\\micro\\projects\\ffBatch\\node_modules\\@babel\\parser\\lib\\index.js:9772:21)\n    at Parser.parseMaybeUnary (C:\\Users\\micro\\projects\\ffBatch\\node_modules\\@babel\\parser\\lib\\index.js:9761:17)\n    at Parser.parseExprOps (C:\\Users\\micro\\projects\\ffBatch\\node_modules\\@babel\\parser\\lib\\index.js:9631:23)\n    at Parser.parseMaybeConditional (C:\\Users\\micro\\projects\\ffBatch\\node_modules\\@babel\\parser\\lib\\index.js:9605:23)\n    at Parser.parseMaybeAssign (C:\\Users\\micro\\projects\\ffBatch\\node_modules\\@babel\\parser\\lib\\index.js:9568:21)\n    at Parser.parseExprListItem (C:\\Users\\micro\\projects\\ffBatch\\node_modules\\@babel\\parser\\lib\\index.js:10984:18)\n    at Parser.parseCallExpressionArguments (C:\\Users\\micro\\projects\\ffBatch\\node_modules\\@babel\\parser\\lib\\index.js:10001:22)\n    at Parser.parseCoverCallAndAsyncArrowHead (C:\\Users\\micro\\projects\\ffBatch\\node_modules\\@babel\\parser\\lib\\index.js:9908:29)\n    at Parser.parseSubscript (C:\\Users\\micro\\projects\\ffBatch\\node_modules\\@babel\\parser\\lib\\index.js:9844:19)\n    at Parser.parseSubscripts (C:\\Users\\micro\\projects\\ffBatch\\node_modules\\@babel\\parser\\lib\\index.js:9815:19)\n    at Parser.parseExprSubscripts (C:\\Users\\micro\\projects\\ffBatch\\node_modules\\@babel\\parser\\lib\\index.js:9798:17)\n    at Parser.parseUpdate (C:\\Users\\micro\\projects\\ffBatch\\node_modules\\@babel\\parser\\lib\\index.js:9772:21)\n    at Parser.parseMaybeUnary (C:\\Users\\micro\\projects\\ffBatch\\node_modules\\@babel\\parser\\lib\\index.js:9761:17)\n    at Parser.parseExprOps (C:\\Users\\micro\\projects\\ffBatch\\node_modules\\@babel\\parser\\lib\\index.js:9631:23)\n    at Parser.parseMaybeConditional (C:\\Users\\micro\\projects\\ffBatch\\node_modules\\@babel\\parser\\lib\\index.js:9605:23)\n    at Parser.parseMaybeAssign (C:\\Users\\micro\\projects\\ffBatch\\node_modules\\@babel\\parser\\lib\\index.js:9568:21)\n    at Parser.parseExpression (C:\\Users\\micro\\projects\\ffBatch\\node_modules\\@babel\\parser\\lib\\index.js:9520:23)\n    at Parser.parseStatementContent (C:\\Users\\micro\\projects\\ffBatch\\node_modules\\@babel\\parser\\lib\\index.js:11479:23)\n    at Parser.parseStatement (C:\\Users\\micro\\projects\\ffBatch\\node_modules\\@babel\\parser\\lib\\index.js:11348:17)\n    at Parser.parseBlockOrModuleBlockBody (C:\\Users\\micro\\projects\\ffBatch\\node_modules\\@babel\\parser\\lib\\index.js:11930:25)\n    at Parser.parseBlockBody (C:\\Users\\micro\\projects\\ffBatch\\node_modules\\@babel\\parser\\lib\\index.js:11916:10)\n    at Parser.parseTopLevel (C:\\Users\\micro\\projects\\ffBatch\\node_modules\\@babel\\parser\\lib\\index.js:11279:10)\n    at Parser.parse (C:\\Users\\micro\\projects\\ffBatch\\node_modules\\@babel\\parser\\lib\\index.js:12984:10)\n    at parse (C:\\Users\\micro\\projects\\ffBatch\\node_modules\\@babel\\parser\\lib\\index.js:13037:38)\n    at parser (C:\\Users\\micro\\projects\\ffBatch\\node_modules\\@babel\\core\\lib\\parser\\index.js:54:34)\n    at parser.next (<anonymous>)\n    at normalizeFile (C:\\Users\\micro\\projects\\ffBatch\\node_modules\\@babel\\core\\lib\\transformation\\normalize-file.js:99:38)\n    at normalizeFile.next (<anonymous>)\n    at run (C:\\Users\\micro\\projects\\ffBatch\\node_modules\\@babel\\core\\lib\\transformation\\index.js:31:50)\n    at run.next (<anonymous>)\n    at Function.transform (C:\\Users\\micro\\projects\\ffBatch\\node_modules\\@babel\\core\\lib\\transform.js:27:41)");

/***/ })

/******/ });
//# sourceMappingURL=index.js.map