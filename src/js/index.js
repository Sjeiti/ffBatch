import 'bootstrap/dist/css/bootstrap.min.css'
import '../style/screen.less'

const {body, body: {classList: bodyClassList}} = document
const canDrop = (('draggable' in body)||('ondragstart' in body&&'ondrop' in body))&&'FormData' in window&&'FileReader' in window
const canRead = !!(window.File && window.FileReader && window.FileList && window.Blob)

const eventNamesPrevent = 'drag dragstart dragend dragover dragenter dragleave drop'.split(' ')
const eventNamesEnter = 'dragover dragenter'.split(' ')
const eventNamesLeave = 'dragleave dragend drop'.split(' ')

const getNameType = name=>({
  size_factor: 'number'
  ,variation: 'number'
  ,seamless:  'checkbox'
  ,antialiasing: 'number'
  ,map_type: 'select'
  ,edges_only:  'checkbox'
  ,clip_hdr_for_result:  'checkbox'

  ,AngleControl:  'range'
  ,CheckboxControl:  'checkbox'
  ,ColorMapControl:  'color'
  ,CurveControl:  'hidden' // todo?
  ,GrayscaleMapControl:  'hidden' // todo?
  ,IntSliderControl:  'range'
  ,SliderControl:  'range'
  ,ValueControl:  'number'
}[name])
const getFormControlClassName = type=>({
  checkbox:  'form-check-input'
  ,range: 'form-range'
  ,select: 'form-select'
}[type]||'form-control')

const classnameDragOver = 'is-dragover'
const addDragOverClass = DOMTokenList.prototype.add.bind(bodyClassList,classnameDragOver)
const remDragOverClass = DOMTokenList.prototype.remove.bind(bodyClassList,classnameDragOver)

const fileReader = new FileReader()

let nodeFilter
let nodePresets

const $ = document.querySelector.bind(document)
const elmTabAbout = $('#tabs-about')
const elmTabFilter = $('#tabs-filter')
const elmFilterName = $('#filter-name')
const elmFilterSettings = $('#filter-settings')
const elmTabControls = $('#tabs-controls')
const elmFilterControls = $('#filter-controls')
const elmPreset = $('#filter-preset')

const forEach = Array.prototype.forEach

console.log('canDrop',canDrop) // todo: remove log
console.log('canRead',canRead) // todo: remove log


if (canDrop&&canRead) {
  eventNamesPrevent.forEach(eventName=>body.addEventListener(eventName,onPreventAndStop))
  eventNamesEnter.forEach(eventName=>body.addEventListener(eventName,()=>addDragOverClass()))
  eventNamesLeave.forEach(eventName=>body.addEventListener(eventName,()=>remDragOverClass()))
  fileReader.addEventListener('load',onFileLoad)
  body.addEventListener('drop',onDropped)
  elmPreset.addEventListener('change',onPresetChange)
}


function onPreventAndStop(e){
  e.preventDefault()
  e.stopPropagation()
}

function onDropped(e){
  const {dataTransfer: {files: [file]}} = e
  // todo: check file
  fileReader.readAsDataURL(file)
}

function onFileLoad(e){
  const result = e.target.result
  const base64 = result.split(',').pop()
  const xmlString = atob(base64)
  const parser = new DOMParser()
  nodeFilter = parser.parseFromString(xmlString, 'text/xml')
  fillFilter(nodeFilter)
}

function onPresetChange(){
  fillFilterPreset(nodePresets[elmPreset.value])
}





function fillFilter(filter){
  var information = filter.querySelector('Information');
  //
  elmFilterName.textContent = information.getAttribute('name-en');
  elmTabAbout.checked = false;
  elmTabFilter.checked = true;
  elmTabControls.checked = true;
  //
  nodePresets = filter.querySelector('Presets').children
  //
  empty(elmPreset);
  forEach.call(nodePresets,(preset,i)=>{
    var nodeName = preset.nodeName
        ,isDefault = nodeName==='DefaultPreset';
    createElement('option',null,elmPreset,{value:i},nodeName+(isDefault?'':' '+i));
  });
  fillFilterPreset(nodePresets[0]);
}

function fillFilterPreset(preset){
  fillSettings(preset.querySelector('Settings').attributes)
  fillControls(preset.querySelector('Controls'))
}

function fillSettings(settings){
  empty(elmFilterSettings)
  elmFilterSettings.appendChild(getFragmentWith(Array.from(settings).map(setting=>{
    const {name, value} = setting
    const type = getNameType(name)
    const className = getFormControlClassName(type)
    return tmpl('form_element_single',{
      id: 'filtersetting_'+name
      ,title: name
      ,value
      ,type
      ,className
    })
  })))
}

function fillControls(nodeControls){
  empty(elmFilterControls);
  elmFilterControls.appendChild(getFragmentWith(Array.from(nodeControls.children).map(node=>{
    const {nodeName, id} = node
    const title = nodeFilter.querySelector(`Components *[id="${id}"] Name`).getAttribute('value-en')
    const type = getNameType(nodeName)

    // const isCheckbox = nodeName==='CheckboxControl'
    // const value = node.querySelector(isCheckbox?'Checked':'Value').getAttribute('value')
    const value = getControlValue(node)

    console.log('nodeName',nodeName, value) // todo: remove log

    return tmpl('form_element_range',{
      id: 'filtersetting_'+name
      ,title
      ,value
      ,type
      ,className: getFormControlClassName(type)
    })
  })))
}






/**
 * Small utility method for quickly creating elements.
 * @method
 * @param {String} [type='div'] The element type
 * @param {String|Array} classes An optional string or list of classes to be added
 * @param {HTMLElement} parent An optional parent to add the element to
 * @param {Object} attributes
 * @param {String} text
 * @param {Object} events
 * @returns {HTMLElement} Returns the newly created element
 */
function createElement(type,classes,parent,attributes,text,events){
  var mElement = document.createElement(type||'div');
  if (attributes) for (var attr in attributes) mElement.setAttribute(attr,attributes[attr]);
  if (classes) {
    var oClassList = mElement.classList
      ,aArguments = typeof(classes)==='string'?classes.split(' '):classes;
    oClassList.add.apply(oClassList,aArguments);
  }
  if (text) mElement.textContent = text;
  if (events) for (var event in events) mElement.addEventListener(event,events[event]);
  parent&&parent.appendChild(mElement);
  return mElement;
}

let oTmplCache = {};
function tmpl(str, data){
  /* jshint -W054 */
  // Figure out if we're getting a template, or if we need to
  // load the template - and be sure to cache the result.
  var fn = !/\W/.test(str) ?
    oTmplCache[str] = oTmplCache[str] ||
    tmpl(document.getElementById(str).innerHTML) :
    // Generate a reusable function that will serve as a template
    // generator (and which will be cached).
    new Function("obj",
    "var p=[],print=function(){p.push.apply(p,arguments);};" +
    // Introduce the data as local variables using with(){}
    "with(obj){p.push('" +
    // Convert the template into pure JavaScript
    str
      .replace(/[\r\t\n]/g, " ")
      .split("<%").join("\t")
      .replace(/((^|%>)[^\t]*)'/g, "$1\r")
      .replace(/\t=(.*?)%>/g, "',$1,'")
      .split("\t").join("');")
      .split("%>").join("p.push('")
      .split("\r").join("\\'")
    + "');}return p.join('');");
  // Provide some basic currying to the user
  return data ? fn( data ) : fn;
}

function empty(element){
  while (element.children.length) element.removeChild(element.firstElementChild);
}

function getInputTypeFor(value) {
  var type = 'text';
  if (value==='true'||value==='false') type = 'checkbox';
  else if (!isNaN(parseFloat(value))) type = 'number';
  return type;
}

function getFragmentWith(HTMLStrings){
  const fragment = document.createDocumentFragment()
  const wrap = document.createElement('div')
  HTMLStrings.forEach(string=>{
    wrap.innerHTML = string
    fragment.appendChild(wrap.firstElementChild);
  })
	return fragment
}

function getControlValue(node){
  const {nodeName} = node
	if (nodeName==='CheckboxControl') {
	  return node.querySelector('Checked').getAttribute('value')
  } else if (nodeName==='ColorMapControl') {
	  const color = node.querySelector('Color')
	  return '#' + [color.red, color.green, color.blue].map(n=>(parseFloat(n)*256<<0).toString(16).padStart(2, '0')).join('')
  } else {
	  return node.querySelector('Value').getAttribute('value')
  }
}
