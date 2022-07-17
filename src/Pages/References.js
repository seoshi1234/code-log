import React from 'react'
import Reference from '../Components/Reference'
import { IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import './References.css'
import { useState } from 'react';
import AddReference from '../Components/AddReference';

function References(props) {

  const [addReferenceOpened, setAddReferenceOpened] = useState(false);
  
  return (
    <div className='references'>
      {
        props.references?.map((reference,i)=>{          
          return(<Reference reference={reference.data()} key={i}/>)
        })
      }

      <AddReference addReferenceOpened={addReferenceOpened} close={()=>setAddReferenceOpened(false)}/>

      <div className='app__navigationBtn0Container' >
        <IconButton className='app__navigationBtn0' onClick={()=>setAddReferenceOpened(!addReferenceOpened)}>
          <AddIcon sx={{fontSize:'40px', color:'#0d1117'}}/>
        </IconButton>
      </div>
    </div>
  )
}

export default References