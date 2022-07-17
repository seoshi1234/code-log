import { Button } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { openAlert } from '../redux/store';
import { db } from '../firebase';
import './AddReference.css';

function AddReference(props) {
  
  const dispatch = useDispatch();

  const [title,setTitle] = useState('');
  const [description,setDescription] = useState('');
  const [link,setLink] = useState('');

  const addReference= ()=>{
    if(title==="" || description==="" || link===""){
      dispatch(openAlert("빈칸을 다 채워주세요!"));
      return;
    }
    db.collection('references').add({title:title,description:description,url:link}).then(()=>{
      dispatch(openAlert("업로드가 완료되었습니다!"));
    });
  }

  return (
    <div className={`addReference ${
      props.addReferenceOpened?'':'disabled'
    }`} >
      <p className='addReference__title'>레퍼런스 추가하기</p>
      <hr />
      <input type="text" placeholder='제목' className="addReference__input" onChange={(e)=>setTitle(e.target.value)}/>
      <input type="text" placeholder='설명' className="addReference__input" onChange={(e)=>setDescription(e.target.value)}/>
      <input type="text" placeholder='링크' className="addReference__input" onChange={(e)=>setLink(e.target.value)}/>
      <br />
      <Button variant="contained" style={{margin:'9px'} } onClick={addReference}>추가하기</Button>
      <Button variant="contained" style={{margin:'9px'}} color={'error'} onClick={props.close}>취소하기</Button>
    </div>
  )
}

export default AddReference