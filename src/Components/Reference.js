import React, { useEffect, useState } from 'react'
import './Reference.css'

function Reference(props) {
  const [thumbnailUrl,setThumbnailUrl] = useState('');

  useEffect(()=>{    
    (async function(){
      const response = await fetch('https://intense-peak-34491.herokuapp.com/'+props.reference.url);
      const html = await response.text();
      const parser = new DOMParser();
      const doc =parser.parseFromString(html,'text/html');
      const metatags = doc.querySelectorAll('meta');      
      metatags.forEach((el)=>{
        if(el.hasAttribute('property')){          
          if(el.getAttribute('property')=='og:image'){            
            setThumbnailUrl(el.getAttribute('content'));
          }
        }
      })      
    })();
    
  },[props])

  return (
    <div className='reference' onClick={()=>window.open(props.reference.url, '_blank').focus()}>
      <div className="reference__thumbnail" style={{backgroundImage:`url(${thumbnailUrl})`}}></div>
      <p className="reference__title">{props.reference.title}</p>
      <p className="reference__description">{props.reference.description}</p>
    </div>
  )
}

export default Reference