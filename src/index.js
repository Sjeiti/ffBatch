import 'bootstrap/dist/css/bootstrap.min.css'
import './style/screen.less'
import React from 'react'
import ReactDOM from 'react-dom'
import 'core-js/stable'
import 'regenerator-runtime/runtime' // these fix async await for babel
import 'mc_picker/dist/index'        // these fix async await for babel

// import { store } from './model/store'
import { App } from './App'
// import './style/main.scss'
// import './i18n'
// import {getCloud} from './service/cloud'

ReactDOM.render(<App/>, document.getElementById('app'))
// getCloud()

/**
 * @typedef {object} ReactElement
 * @property {Symbol} $$typeof
 * @property {object} key
 * @property {object} props
 * @property {object} ref
 * @property {object} type
 */
