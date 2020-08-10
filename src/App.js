import React, {useCallback, useState, useEffect} from 'react'
import {hot} from 'react-hot-loader'
import styled from 'styled-components'
import {useDropzone} from 'react-dropzone'
import {Number, Checkbox, Range, Select, Color, Hidden} from './components/Input'

const getInput = name=>({
  size_factor:           Number
  ,variation:            Number
  ,seamless:             Checkbox
  ,antialiasing:         Number
  ,map_type:             Select
  ,edges_only:           Checkbox
  ,clip_hdr_for_result:  Checkbox

  ,AngleControl:         Range
  ,CheckboxControl:      Checkbox
  ,ColorMapControl:      Color
  ,CurveControl:         Hidden // todo?
  ,GrayscaleMapControl:  Hidden // todo?
  ,IntSliderControl:     Range
  ,SliderControl:        Range
  ,ValueControl:         Number
}[name])

// const getFormControlClassName = type=>({
//   checkbox:  'form-check-input'
//   ,range: 'form-range'
//   ,select: 'form-select'
// }[type]||'form-control')

const Layout = styled.div`
  width: 100%;
  height: 100%;
  //box-shadow: 0 0 0 1rem red inset;
`

export const App = hot(module)(() => {

  const [filter, setFilter] = useState(null)
  const [filterName, setFilterName] = useState('')
  const [presets, setPresets] = useState([])
  const [preset, setPreset] = useState(null)
  const [settings, setSettings] = useState([])
  const [controls, setControls] = useState([])

  const [controlsArray, setControlsArray] = useState([]) // todo WMWMWMWMWMWMWM

  const onDrop = useCallback(acceptedFiles => {
    const [file] = acceptedFiles
    // todo: check file
    const fileReader = new FileReader()
    fileReader.addEventListener('load', e=>{
      const result = e.target.result
      const base64 = result.split(',').pop()
      const xmlString = atob(base64)
      const parser = new DOMParser()
      setFilter(parser.parseFromString(xmlString, 'text/xml'))
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
      setSettings(settings)
      setControls(controls)

      setControlsArray(controls.map((control,index)=>{
        const {nodeName, id} = control
        const value = control.querySelector('Value')?.getAttribute('value')
        const name = filter.querySelector(`Components *[id="${id}"] Name`).getAttribute('value-en')
        const Input = getInput(nodeName)
        return {id, name, value, valueTo:value, Input, index}
      }))

      console.log('preset',preset) // todo: remove log
      console.log('controls',controls,preset.querySelector('Controls')) // todo: remove log
    }
  }, [filterPreset, presets])

  useEffect(()=>{
    console.log('controlsArray',controlsArray) // todo: remove log
  },[controlsArray])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return <Layout {...getRootProps()} className="container-fluid">
    <h1>FFBatch</h1>

    <h2><label htmlFor="tabs-about">about</label></h2>
    <input type="checkbox" name="tabs" id="tabs-about" className="tabs" />
    <div className="tab">
      <p>Drag and drop your filter.ffxml into the window</p>
    </div>

    <h2><label htmlFor="tabs-filter">filter</label></h2>
    <input type="checkbox" name="tabs" id="tabs-filter" className="tabs" defaultChecked />
    <div className="tab">
      <h3>{filterName}</h3>
      <div className="mb-3 row">
        <label htmlFor="filter-preset" className="form-label col-2">preset</label>
        <div className="col-10">
          <Select id="filter-preset" value={filterPreset} onChange={onFilterPresetChange} options={presets.map(({nodeName},i)=>({
            value: i
            ,key: i
            ,text: nodeName+(nodeName==='DefaultPreset'?'':' '+i)}))
          }/>
        </div>
      </div>
    </div>

    <h2><label htmlFor="tabs-settings">settings</label></h2>
    <input type="checkbox" name="tabs" id="tabs-settings" className="tabs" />
    <div className="tab">
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet architecto at neque totam voluptates. Animi consequatur culpa neque nobis placeat ratione repudiandae voluptas. Consequatur dicta dolore doloremque eos ipsam obcaecati?</p>
      {settings.map(setting=>{
        const {name, value} = setting
        const Input = getInput(name)
        const id = 'filtersetting_'+name
        return <div className="mb-3 row" key={name}>
          <label htmlFor={id} className="col-4">{name}</label>
          <div className="col-8">
            <Input {...{id, value}} />
          </div>
        </div>
      })}
    </div>

    <h2><label htmlFor="tabs-controls">controls</label></h2>
    <input type="checkbox" name="tabs" id="tabs-controls" className="tabs" defaultChecked />
    <div className="tab">
      <p>Animi consequatur culpa neque nobis placeat ratione repudiandae voluptas. Consequatur dicta dolore doloremque eos ipsam obcaecati?</p>
      {controlsArray.map(control=>{
        const {id, name, value, valueTo, Input, index} = control
        const onChange = e=>{
          const newControlsArray = [...controlsArray]
          newControlsArray[index] = {...control, value: e.target.value}
          setControlsArray(newControlsArray)
        }
        const onChangeTo = e=>{
          const newControlsArray = [...controlsArray]
          newControlsArray[index] = {...control, valueTo: e.target.value}
          setControlsArray(newControlsArray)
        }
        // const {nodeName, id} = control
        // const value = control.querySelector('Value')?.getAttribute('value')
        // const name = filter.querySelector(`Components *[id="${id}"] Name`).getAttribute('value-en')
        // const Input = getInput(nodeName)
        // value
        // const id = name.toLowerCase().replace(/[^a-z0-9]/g,'-')+i
        return <div className="mb-3 row" key={id}>
          <label htmlFor={id} className="col-4">{name}</label>
          <div className="col-4">
            <Input {...{id, value, onChange}} />
          </div>
          <div className="col-4">
            <Input {...{id, value:valueTo, onChange:onChangeTo}} />
          </div>
        </div>
      })}

    </div>

    <h2><label htmlFor="tabs-download">download</label></h2>
    <input type="checkbox" name="tabs" id="tabs-download" className="tabs" />
    <div className="tab">
      <p>Amet architecto at neque totam voluptates.</p>
      <button type="button" className="btn btn-primary">Download</button>
    </div>
  </Layout>
})
