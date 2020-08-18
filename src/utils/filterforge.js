import {Checkbox,Color,ColorMap,Hidden,Number,Range,Select,Text} from '../components/Input'
import {parseXMLString, outerXML} from './index'
import tasks from '../data/tasks.xml'
import JSZip from 'jszip'
import FileSaver from 'file-saver'

export const defaultStorage = '{"size":{"width":256,"height":256},"frames":32,"renderer":"C:\\\\Program Files\\\\Filter Forge 8\\\\bin\\\\FFXCmdRenderer-x64.exe"}'

export const channels = [
  { value: 1, name: 'Final' }
  ,{ value: 2, name: 'Diffuse' }
  ,{ value: 3, name: 'Bump' }
  ,{ value: 4, name: 'Normal' }
  ,{ value: 5, name: 'Specular strength' }
  ,{ value: 6, name: 'Specular exponent' }
  ,{ value: 7, name: 'Metallicity' }
  ,{ value: 8, name: 'Ambient occlusion' }
  ,{ value: 9, name: 'Reflective occlusion' }
]

export const fileType = {
  FFXML: 'text/xml-filterforge-filter'
  ,XML: 'text/xml'
  ,JPG: 'image/jpeg'
  ,GIF: 'image/gif'
  ,PNG: 'image/png'
}

export const controlType = {
  ColorMapControl: 'ColorMapControl'
}

export const getSettingsProps = name=> {
  const [Input,props] = {
    size_factor:  [Range, {step:1, min:1, max:64}],
    variation:    [Range, {step:1, min:1, max:30000}],
    seamless:     [Checkbox],
    antialiasing: [Number],
    // map_type:     [Select, {options: [{name:'',value:0},{name:'',value:1}]}],
    map_type:     [Hidden],
    edges_only:   [Checkbox],
    clip_hdr_for_result: [Checkbox]
  }[name]
  return {...(props||{}), Input, id: 'filtersetting_'+name }
}

export const getControlsProps = node=>{
  const {nodeName, id} = node
  const [Input, propz] = {
    AngleControl:        [Range, {min:0, max:360}],
    CheckboxControl:     [Checkbox],
    ColorMapControl:     [ColorMap],
    CurveControl:        [Hidden],
    GrayscaleMapControl: [Range, {step:1/256/8, max:1}],
    IntSliderControl:    [Range, {step:1}],
    SliderControl:       [Range, {step:1/256/8, max:1}],
    ValueControl:        [Number]
  }[nodeName]||[Hidden]
  const props = {...(propz||{}), Input, id }
  Array.from(node.children).forEach(node=>{
    const {nodeName} = node
    if (nodeName==='Name') {
      props.name = node.getAttribute('value-en')
    // } else if (nodeName==='RangeMax') {
    //   props.max = node.getAttribute('value')
    }
  })
  return props
}

const cloneTo = (node, nodeName) => {
  const ffPreset = node.ownerDocument.createElement(nodeName)
  const clone = node.cloneNode(true)
  while (clone.firstElementChild) ffPreset.appendChild(clone.firstElementChild)
  return ffPreset
}

export const downloadZip = (filter, controls, filterName, size, frames, channelValues, renderer, images, animation=true) =>{
  // console.log('downloadZip',{filter, controls, filterName, size, frames, channelValues, animation}) // todo: remove log
  const name = filterName.toLowerCase().replace(/[^a-z]/g, '-').replace(/^-|-$/g, '')
  const fileName = `ffbatch_${name}`
  const fileNameFFXML = `${fileName}.ffxml`
  const fileNameXML = `${fileName}.xml`
  const fileNameBat = `${fileName}.bat`
  const fileNameSh = `${fileName}.sh`
  const fileNameZip = `${fileName}.zip`
  const imageMap = new Map()
  //
  const zip = new JSZip()
  //
  const digits = frames.toString().length
  //
  const ffxml = filter.cloneNode(true)
  const ffxmlPresets = ffxml.querySelector('Presets')
  const ffxmlDefaultPreset = ffxmlPresets.querySelector('DefaultPreset')
  const ffxmlPreset = ffxmlPresets.querySelector('Preset')||ffxmlDefaultPreset&&cloneTo(ffxmlDefaultPreset, 'Preset')
  //
  if (!animation) {
    const ffPreset = cloneTo(ffxmlDefaultPreset, 'Preset')
    // const ffPreset = filter.createElement('Preset')
    // const clone = ffxmlDefaultPreset.cloneNode(true)
    // while (clone.firstElementChild) ffPreset.appendChild(clone.firstElementChild)
    ffxmlPreset&&ffxmlPresets.insertBefore(ffPreset,ffxmlPreset)||ffxmlPresets.appendChild(ffPreset)
  }
  //
  animation&&Array.from(ffxmlPresets.querySelectorAll('Preset')).forEach(preset=>ffxmlPresets.removeChild(preset))
  //
  const xml = parseXMLString(tasks)
  const xmlRoot = xml.documentElement
  const xmlTask = xmlRoot.querySelector('Task')
  xmlRoot.removeChild(xmlTask)
  const xmlTaskImage = xmlTask.querySelector('Image')
  xmlTaskImage.setAttribute('width', size.width)
  xmlTaskImage.setAttribute('height', size.height)
  //
  if (animation) {
    for (let i=0;i<frames;i++) {
      const part = i/(frames-1)
      const preset = ffxmlPreset.cloneNode(true)
      // FFXML
      controls.forEach(control=>{
        const {id, value:valueFrom, valueTo} = control
        if ([Number,Range].includes(control.Input)) {
          // todo valueFrom and valueTo should be number here
          const valueF = parseFloat(valueFrom)
          const valueT = parseFloat(valueTo)
          const node = preset.querySelector(`[id="${id}"]`)
          const value = valueF + part*(valueT-valueF)
          node.querySelector('Value').setAttribute('value', value)
        } else if (control.Input===ColorMap) {
          // todo: Input === Color
          const image = images.find(img=>img.name===valueFrom)
          image&&imageMap.set(valueFrom, image.data)
          const controlNode = preset.querySelector(`[id="${id}"]`)
          const imageNode = controlNode.querySelector('InputImage')||xml.createElement('InputImage')
          imageNode.setAttribute('value', image.name)
          controlNode.appendChild(imageNode)
        }
      })
      ffxmlPresets.appendChild(preset)
      // XML
      const task = xmlTask.cloneNode(true)
      const path = `${fileName}_${(i+1).toString().padStart(digits, '0')}.jpg`
      task.querySelector('Result').setAttribute('path', path)
      task.querySelector('Filter').setAttribute('value', fileNameFFXML)
      task.querySelector('Preset').setAttribute('value', i+1)
      xmlRoot.appendChild(task)
    }
  } else { // channels
    const presetsList = ffxmlPresets.querySelectorAll('Preset')
    const presetsArray = Array.from(presetsList)
    presetsArray.forEach(p=>ffxmlPresets.removeChild(p))
    //
    // const numChannels = channelValues.filter(c=>c).length
    let presetIndex = 0
    channelValues.forEach((checked,index)=>{
      if (checked) {
        const {value, name} = channels[index]
        presetsArray.forEach((p,presetNr)=>{
          presetIndex++
          // FFXML
          const preset = p.cloneNode(true)
          preset.querySelector('Settings').setAttribute('map_type', value)
          ffxmlPresets.appendChild(preset)
          // XML
          const task = xmlTask.cloneNode(true)
          const slug = name.toLowerCase().replace(/-/g,'-')
          const path = `${fileName}_${presetNr}_${slug}.jpg`
          task.querySelector('Result').setAttribute('path', path)
          task.querySelector('Filter').setAttribute('value', fileNameFFXML)
          task.querySelector('Preset').setAttribute('value', presetIndex)
          xmlRoot.appendChild(task)
        })
      }
    })
  }
  // add images to zip
  imageMap.forEach((value,key)=>zip.file(key, value.match(/base64,(.*)/).pop(), {base64: true}))
  //
  zip
      .file(fileNameFFXML, outerXML(ffxml))
      .file(fileNameXML,   outerXML(xml))
      .file(fileNameBat,   `@echo off
echo ----- START BATCH -----
CALL "${renderer}" ${fileNameXML}
echo ----- END BATCH -----`)
      .file(fileNameSh,   `echo '----- START BATCH -----'
"${renderer}" ${fileNameXML}
echo '----- END BATCH -----'`)
      .generateAsync({type: 'blob'})
      .then(content=>FileSaver.saveAs(content, fileNameZip))
  }

