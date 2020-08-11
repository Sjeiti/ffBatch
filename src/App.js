import React, {useCallback, useState, useEffect} from 'react'
import styled from 'styled-components'
import {hot} from 'react-hot-loader'
import {useDropzone} from 'react-dropzone'
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import {Number, Checkbox, Range, Select, Color, Hidden, File} from './components/Input'
import tasks from './data/tasks.xml'



const outerXML = node => new XMLSerializer().serializeToString(node.documentElement)

const parseXMLString = s => {
  const parser = new DOMParser()
  return parser.parseFromString(s, 'text/xml')
}

const getSettingsProps = name=> {
  const [Input,props] = {
    size_factor:  [Range, {step:1, min:1, max:64}],
    variation:    [Range, {step:1, min:1, max:30000}],
    seamless:     [Checkbox],
    antialiasing: [Number],
    map_type:     [Select, {options: [{name:'',value:0},{name:'',value:1}]}],
    edges_only:   [Checkbox],
    clip_hdr_for_result: [Checkbox]
  }[name]
  return {...(props||{}), Input, id: 'filtersetting_'+name }
}
const getControlsProps = node=>{
  const {nodeName, id} = node
  const [Input, propz] = {
    AngleControl:        [Range, {min:0, max:360}],
    CheckboxControl:     [Checkbox],
    ColorMapControl:     [Color],
    CurveControl:        [Hidden],
    GrayscaleMapControl: [Hidden],
    IntSliderControl:    [Range, {step:1}],
    SliderControl:       [Range, {step:.001, max:1}],
    ValueControl:        [Number]
  }[nodeName]
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

const Tab = ({children, title, id, defaultChecked})=><>
  <h2><label htmlFor={id}>{title}</label></h2>
  <input type="checkbox" name="tabs" className="tabs" {...{id, defaultChecked}} />
  <div className="tab">{children}</div>
</>

const InputRow = ({children, title})=>{
  const {id} = children.props
  return <div className="mb-3 row">
    <label htmlFor={id} className="form-label col-4">{title}</label>
    <div className="col-8">{children}</div>
  </div>
}

const Layout = styled.div`
  width: 100%;
  height: 100%;
  //box-shadow: 0 0 0 1rem red inset;
`

export const App = hot(module)(() => {

  const [frames, setFrames] = useState(32)
  const [renderer, setRenderer] = useState(null)
  const [size, setSize] = useState({width:256,height:256})

  const [filter, setFilter] = useState(null)
  const [filterName, setFilterName] = useState('')
  const [presets, setPresets] = useState([])
  const [preset, setPreset] = useState(null)
  const [settings, setSettings] = useState([])
  const [controls, setControls] = useState([])

  const onDrop = useCallback(acceptedFiles => {
    const [file] = acceptedFiles
    // todo: check file
    const fileReader = new FileReader()
    fileReader.addEventListener('load', e=>{
      const result = e.target.result
      const base64 = result.split(',').pop()
      const xmlString = atob(base64)
      setFilter(parseXMLString(xmlString))
    })
    fileReader.readAsDataURL(file)
  }, [])

  useEffect(()=>{
    console.log('filter',filter) // todo: remove log
    if (filter) {
      setPresets(Array.from(filter.querySelector('Presets').children))
      setFilterName(filter.querySelector('Information').getAttribute('name-en'))
    }
  }, [filter])

  const [filterPreset, setFilterPreset] = useState(0)
  const onFilterPresetChange = useCallback(e=>setFilterPreset(e.target.value))
  useEffect(()=>{
    const {length} = presets
    if (length>=0&&filterPreset>=0&&filterPreset<length) {
      const preset = presets[filterPreset]
      const settings = Array.from(preset.querySelector('Settings').attributes)
      const controls = Array.from(preset.querySelector('Controls').children)
      setPreset(preset)

      setSettings(settings.map((setting, index)=>{
        const {name, value} = setting
        const props = getSettingsProps(name)
        return {...props, name, value, index}
      }))

      setControls(controls.map((control, index)=>{
        const value = control.querySelector('Value')?.getAttribute('value')
        const colorNode = control.querySelector('Color')
        const color = colorNode&&'#'+['red','green','blue'].map(c=>(255*parseFloat(colorNode.getAttribute(c))<<0).toString(16).padStart(2,'0')).join('')
        const finalValue = value||color
        const component = filter.querySelector(`Components *[id="${control.id}"]`)
        const props = getControlsProps(component)
        return {...props, value:finalValue, valueTo:finalValue, index}
      }))

      console.log('preset',preset) // todo: remove log
    }
  }, [filterPreset, presets])

  const onDownloadButtonClick = e=>{
    e.preventDefault()
    const name = filterName.toLowerCase().replace(/[^a-z]/g, '-').replace(/^-|-$/g, '')
    const fileName = `ffbatch_${name}`
    const fileNameFFXML = `${fileName}.ffxml`
    const fileNameXML = `${fileName}.xml`
    const fileNameBat = `${fileName}.bat`
    const fileNameZip = `${fileName}.zip`
    //
    const digits = frames.toString().length
    //
    const ffxml = filter.cloneNode(true)
    const ffxmlPresets = ffxml.querySelector('Presets')
    const ffxmlPreset = ffxmlPresets.querySelector('Preset')
    Array.from(ffxmlPresets.querySelectorAll('Preset')).forEach(preset=>ffxmlPresets.removeChild(preset))
    //
    const xml = parseXMLString(tasks)
    const xmlRoot = xml.documentElement
    const xmlTask = xmlRoot.querySelector('Task')
    xmlRoot.removeChild(xmlTask)
    const xmlTaskImage = xmlTask.querySelector('Image')
    xmlTaskImage.setAttribute('width', size.width)
    xmlTaskImage.setAttribute('height', size.height)
    //
    for (let i=0;i<frames;i++) {
      const part = i/(frames-1)
      const preset = ffxmlPreset.cloneNode(true)
      console.log('part',part) // todo: remove log
      controls.forEach(control=>{
        // FFXML
        // todo: Input === Color
        if ([Number,Range].includes(control.Input)) {
          const {id, value:valueFrom, valueTo} = control
          // todo valueFrom and valueTo should be number here
          const valueF = parseFloat(valueFrom)
          const valueT = parseFloat(valueTo)
          const node = preset.querySelector(`[id="${id}"]`)
          const value = valueF + part*(valueT-valueF)
          node.querySelector('Value').setAttribute('value', value)
          console.log('c',control.name,valueFrom,valueTo,value) // todo: remove log
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
    new JSZip()
        .file(fileNameFFXML, outerXML(ffxml))
        .file(fileNameXML,   outerXML(xml))
        .file(fileNameBat,   `@echo off
echo ----- START BATCH -----
CALL "C:\\Program Files\\Filter Forge 8\\bin\\FFXCmdRenderer-x64.exe" ${fileNameXML}
echo ----- END BATCH -----`)
        .generateAsync({type: 'blob'})
        .then(content=>FileSaver.saveAs(content, fileNameZip))
  }

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return <Layout {...getRootProps()} className="container-fluid">
    <h1>FFBatch</h1>

    <Tab title="about" id="tab-about">
      <p>Drag and drop your filter.ffxml into the window</p>
      <p>But will it blend?</p>
    </Tab>

    <Tab title="filter" id="tab-filter" defaultChecked>
      <h3>{filterName}</h3>
      <InputRow title="preset">
        <Select id="filter-preset" value={filterPreset} onChange={onFilterPresetChange} options={presets.map(({nodeName},i)=>({
          value: i
          ,key: i
          ,text: nodeName+(nodeName==='DefaultPreset'?'':' '+i)}))
        }/>
      </InputRow>
      <InputRow title="width">
        <Range id="imageWidth" value={size.width} min={2**4} max={2**13} onChange={e=>setSize({...size, width: parseInt(e.target.value, 10)})} />
      </InputRow>
      <InputRow title="height">
        <Range id="imageHeight" value={size.height} min={2**4} max={2**13} onChange={e=>setSize({...size, height: parseInt(e.target.value, 10)})} />
      </InputRow>
      <InputRow title="frames">
        <Range id="frames" value={frames} min={2**2} max={2**11} onChange={e=>setFrames(parseInt(e.target.value, 10))} />
      </InputRow>
      <InputRow title="renderer">
        <File id="renderer" onChange={e=>{
          const [file] = e.target.files
          console.log('file',file) // todo: remove log
          setRenderer(file.name)
        }} />
      </InputRow>
    </Tab>

    <Tab title="settings" id="tab-settings">
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet architecto at neque totam voluptates. Animi consequatur culpa neque nobis placeat ratione repudiandae voluptas. Consequatur dicta dolore doloremque eos ipsam obcaecati?</p>
      {settings.map(setting=>{
        const {id, name, value, Input, index, ...props} = setting
        const onChange = e=>{
        const newSettingsArray = [...settings]
          newSettingsArray[index] = {...setting, value: e.target.value}
          setSettings(newSettingsArray)
        }
        return <div className="mb-3 row" key={name}>
          <label htmlFor={id} className="col-4">{name}</label>
          <div className="col-8">
            <Input {...{id, value, onChange}} {...props} />
          </div>
        </div>
      })}
    </Tab>

    <Tab title="controls" id="tab-controls" defaultChecked>
      <p>Animi consequatur culpa neque nobis placeat ratione repudiandae voluptas. Consequatur dicta dolore doloremque eos ipsam obcaecati?</p>
      {controls.map(control=>{
        const {id, name, value, valueTo, Input, index, ...props} = control
        const onChange = e=>{
          const newControlsArray = [...controls]
          newControlsArray[index] = {...control, value: parseFloat(e.target.value)}
          setControls(newControlsArray)
        }
        const onChangeTo = e=>{
          const newControlsArray = [...controls]
          newControlsArray[index] = {...control, valueTo: parseFloat(e.target.value)}
          setControls(newControlsArray)
        }
        return <div className="mb-3 row" key={id}>
          <label htmlFor={id} className="col-4">{name}</label>
          <div className="col-4">
            <Input {...{id, value, onChange}} {...props} />
          </div>
          <div className="col-4">
            <Input {...{id, value:valueTo, onChange:onChangeTo}} {...props} />
          </div>
        </div>
      })}
    </Tab>

    <Tab title="download" id="tab-download">
      <button type="button" onClick={onDownloadButtonClick} className="btn btn-primary">Download</button>
    </Tab>
  </Layout>
})
