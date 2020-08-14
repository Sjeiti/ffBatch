import {Checkbox,Color,Hidden,Number,Range,Select} from '../components/Input'

export const getSettingsProps = name=> {
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

export const getControlsProps = node=>{
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
