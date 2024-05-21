import React, {useState} from 'react'

export default function FieldText(props:any) {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
    if(props.onChange){
      props.onChange(e.target.value);
    }
  }



  return (
    <div className='mt-4'>
      <label htmlFor={props.usefor} className='font-bold text-left text-xs'>{props.label}</label>
      <br />
      <input type="text" name={props.usefor} id={props.usefor}  className='border-2 border-gold px-3 py-2 text-xs rounded-lg ' placeholder={props.usefor}  value={props.value || value} // controlled component value
        onChange={handleChange} />
    </div>
  )
}
