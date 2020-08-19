import React, {useCallback, useState, useEffect} from 'react'
import {hot} from 'react-hot-loader'
import {useDropzone} from 'react-dropzone'
import {parseXMLString} from './utils'
import {
  channels as channelsList,controlType,defaultStorage,downloadZip,fileType,getControlsProps,getSettingsProps
} from './utils/filterforge'
import {Tab} from './components/Tab'
import {Layout} from './components/Layout'
import {Header} from './components/Header'
import {InputRow} from './components/InputRow'
import {Number, Checkbox, Range, Select, Color, Hidden, File, Text} from './components/Input'
import {Github} from './components/Github'
import {Hr} from './components/Hr'
import {ButtonText} from './components/ButtonText'

const stored = JSON.parse(localStorage.ffbatch||defaultStorage)

const toName = s => s.replace(/[^A-Za-z0-9]/g, ' ')

const {FFXML, XML, JPG, GIF, PNG} = fileType
const imageTypes = [JPG, GIF, PNG]

export const App = hot(module)(() => {

  const [frames, setFrames] = useState(stored?.frames)
  const [renderer, setRenderer] = useState(stored?.renderer)
  const [size, setSize] = useState(stored?.size)
  const [channels, setChannels] = useState(Array.from(new Array(9)).map((n,i)=>i===0))

  const [filter, setFilter] = useState(null)
  const [filterName, setFilterName] = useState('')

  const [presets, setPresets] = useState([])
  const [preset, setPreset] = useState(null)
  const [settings, setSettings] = useState([])
  const [controls, setControls] = useState([])
  const [images, setImages] = useState([])

  const [image, setImage] = useState('')

  useEffect(()=>{
    localStorage.ffbatch = JSON.stringify({size,frames,renderer})
  },[size,frames,renderer])
  useEffect(()=>{
    localStorage.filter&&setFilter(parseXMLString(localStorage.filter))
  },[])

  const onDrop = useCallback((acceptedFiles, b, e) => {
    const [file] = acceptedFiles
    const {name} = file
    const {target} = e
    const fileReader = new FileReader()
    fileReader.addEventListener('load', e=>{
      console.log('fileReader load',e) // todo: remove log
      const result = e.target.result
      const type = result.match(/data:([^;]*)/).pop()
      if (type===FFXML) {
        const base64 = result.split(',').pop()
        const xmlString = atob(base64)
        const filter = parseXMLString(xmlString)
        if (filter.documentElement.nodeName==='Filter') {
          localStorage.filter = xmlString
          setFilter(filter)
        }
      } else if (imageTypes.includes(type)) {
        const closestRow = target.closest('[data-row]')
        const isTargetInRow = closestRow?.contains(target)
        const rowID = closestRow?.dataset.row
        const component = filter.querySelector(`Components [id='${rowID}']`)
        const isColorMapControl = component?.nodeName===controlType.ColorMapControl
        const isInputImage = rowID==='input-image'
        // console.log('rowID',rowID,target) // todo: remove log
        if (isTargetInRow&&(isColorMapControl||isInputImage)) {
          if (isColorMapControl) {
            setControls(controls.slice(0).map(control => {
              const {id} = control
              return id===rowID?{...control, value: name, valueTo: name}:control
            }))
          } else if (isInputImage) {
            setImage(name)
          }
          const isImageExists = !!images.find(a=>a.id===rowID)
          const imageObj = {
            id: rowID
            ,data: result
            ,name
          }
          setImages(isImageExists?images.slice(0).map(image => image.id===rowID?imageObj:image):[...images, imageObj])
        } else {
          // todo: alert correct dropzone
          console.warn('drop images somewhere else')
        }
      } else {
        // todo: alert about correct filetypes to drop
      }
    })
    fileReader.readAsDataURL(file)
  }, [filter, controls, images])

  //////////////////////
  // useEffect(()=>{
  //   console.log('images',images) // todo: remove log
  // }, [images])
  //////////////////////

  useEffect(()=>{
    console.log('filter',filter) // todo: remove log
    if (filter) {
      setPresets(Array.from(filter.querySelector('Presets').children))
      setFilterName(filter.querySelector('Information').getAttribute('name-en'))
    } else {
      setPresets([])
      setFilterName('')
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
    } else {
      setPreset(null)
      setSettings([])
      setControls([])
    }
  }, [filterPreset, presets])

  const onClickClearFilter = useCallback(e=>{
    setFilter(null)
    localStorage.filter = ''
  })

  const onDownloadButtonAnimationClick = e=>{
    e.preventDefault()
    downloadZip(filter, controls, filterName, size, frames, channels, renderer, images, image)
  }

  const onDownloadButtonPresetsClick = e=>{
    e.preventDefault()
    downloadZip(filter, controls, filterName, size, frames, channels, renderer, images, image, false)
  }

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
  // const getRootProps = ()=>return {"data-foo":23}

  const disabled = !filterName

  return <Layout {...getRootProps()} className="container-fluid">
    <Header>
      <a href="https://github.com/sjeiti/ffbatch" className="float-right"><Github /></a>
      <h1>FFBatch{filterName&&':'} <strong>{filterName}</strong>{
        filterName&&<ButtonText onClick={onClickClearFilter}>×</ButtonText>
      }</h1>
      <small>{_VERSION}</small>
    </Header>

    {filterName?'':<p className="alert alert-primary">Drag and drop your filter.ffxml into this window</p>}

    <Tab title="about" id="tab-about">
      <p>This is a helper web-app to use with the <a href="https://www.filterforge.com/">Filter Forge</a> command line renderer.</p>
      <p>The app is geared towards animating filter properties but it can also create files for rendering all the presets and/or render maps (diffuse, normal, bump). The resulting XML files can be downloaded as a zip and should be used with the Filter Forge command line binary.</p>
      <p>The code of this webapp is <a href="https://github.com/sjeiti/ffbatch">open-sourced on Github</a> where you can add issues or feature requests.</p>
      <p>This app is a rewrite of <a href="https://www.filterforge.com/forum/read.php?PAGEN_1=1&FID=5&TID=6133&sphrase_id=4710101#nav_start">an earlier PHP-based solution</a>. It was no longer working and things like that can be done solely client-side these days.</p>
    </Tab>

    <Hr/>

    <Tab title="filter" id="tab-filter" {...{disabled}} defaultChecked>
      <p>Note that preset changes the control settings to that that of the preset.</p>
      <InputRow title="preset">
        <Select id="filter-preset" value={filterPreset} onChange={onFilterPresetChange} options={presets.map(({nodeName},i)=>({
          value: i
          ,key: i
          ,text: nodeName+(nodeName==='DefaultPreset'?'':' '+i)}))
        }/>
      </InputRow>

      <InputRow title="input image">
          <Text id="input-image" value={image} onChange={e=>setImage(e.target.value)} />
          {image&& <img src={images.find(img=>img.name===image)?.data} alt="input image" style={{height:'2.375rem',boxShadow:'0 0 0.25rem rgba(0,0,0,0.3)'}} />}
      </InputRow>

      <InputRow title="size">
        <Number id="imageWidth" value={size.width} min={2**4} max={2**13} onChange={e=>setSize({...size, width: parseInt(e.target.value, 10)})} />
        <Number id="imageHeight" value={size.height} min={2**4} max={2**13} onChange={e=>setSize({...size, height: parseInt(e.target.value, 10)})} />
      </InputRow>
      <InputRow title="frames">
        <Number id="frames" value={frames} min={2**2} max={2**11} onChange={e=>setFrames(parseInt(e.target.value, 10))} />
      </InputRow>
      <InputRow title="renderer">
        <Text id="renderer" value={renderer} onChange={e=>setRenderer(e.target.value)} />
      </InputRow>
    </Tab>

    <Tab title="settings" id="tab-settings" {...{disabled}}>
      <p>These are generic settings that cannot be animated</p>
      {settings.map(setting=>{
        const {id, name, value, Input, index, ...props} = setting
        const onChange = e=>{
        const newSettingsArray = [...settings]
          newSettingsArray[index] = {...setting, value: e.target.value}
          setSettings(newSettingsArray)
        }
        const isValid = Input!==Hidden
        return isValid&&<InputRow title={toName(name)} key={id}>
          <Input {...{id, value, onChange}} {...props} />
        </InputRow>
      })}
    </Tab>

    <Tab title="controls" id="tab-controls" {...{disabled}} defaultChecked>
      <p>These control the start- and end-values of the animation output.</p>
      {controls.map(control=>{
        const {id, name, value, valueTo, Input, index, ...props} = control
        const onChange = e=>{
          const {value: rawValue, type} = e.target
          const value = ['number','range'].includes(type)?parseFloat(rawValue):rawValue
          const newControlsArray = [...controls]
          newControlsArray[index] = {...control, value}
          setControls(newControlsArray)
        }
        const onChangeTo = e=>{
          const {value: rawValue, type} = e.target
          const valueTo = ['number','range'].includes(type)?parseFloat(rawValue):rawValue
          const newControlsArray = [...controls]
          newControlsArray[index] = {...control, valueTo}
          setControls(newControlsArray)
        }
        const isValid = Input!==Hidden

        return isValid&&<InputRow title={toName(name)} key={id}>
          <Input {...{id, value, onChange}} {...props} />
          <Input {...{id, value:valueTo, onChange:onChangeTo}} {...props} />
        </InputRow>
      })}
    </Tab>

    <Hr />

    <Tab title="download" id="tab-download" {...{disabled}} defaultChecked>
      <fieldset className="mt-2 mb-2">
        <button type="button" onClick={onDownloadButtonAnimationClick} className="btn btn-primary">Download animation files</button>
      </fieldset>
      <fieldset className="mb-4">
        <button type="button" onClick={onDownloadButtonPresetsClick} className="btn btn-primary">Download all presets</button>
        <ul className="list-unstyled mt-2">
          <li><strong>channels</strong> (non-animation only)</li>
          {channels.map((checked, index) => {
            const {value, name} = channelsList[index]
            const onChange = e=>{
              const newChannelsArray = [...channels]
              newChannelsArray[index] = e.target.checked
              setChannels(newChannelsArray)
            }
            return <li key={index}><label><Checkbox name="channel" {...{value, onChange, checked}} /> {name}</label></li>
          })}
        </ul>
      </fieldset>
      <p>The download zip file contains an XML and an FFXML file. Simply unzip and call the command line renderer with the XML file as parameter. For example:</p>
      <pre><code>"C:\Program Files\Filter Forge 8\bin\FFXCmdRenderer-x64.exe" ffbatch_fire.xml</code></pre>
      <p>You can also execute the `.bat` or `.sh` for Windows and OSX users respectively <small>(proviced you filled in the correct location of the binary under `filter - renderer`)</small>.</p>
      <p>A third option is to just drag the XML file onto the binary file.</p>
      <p>When the renderer has done it's job you can stitch all rendered files into an animation. A simple online tool could be <a href="https://ezgif.com/maker">Animated GIF Maker</a>, but there are plenty more online.</p>
    {/*    */}
    </Tab>
  </Layout>
})
