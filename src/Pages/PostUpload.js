import React,{useEffect, useRef, useState} from 'react'
import MDEditor from '@uiw/react-md-editor';
import Button from '@mui/material/Button';
import { IconButton } from '@mui/material';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import {db,storage} from '../firebase';
import {useSelector} from 'react-redux';
import getLanguageTableAndSet from '../Languages.js';
import {useDispatch} from 'react-redux';
import {forceCloseAlert, openAlert} from '../redux/store.js';
import { useNavigate } from 'react-router-dom';





function PostUpload(props) {
  const dispatch = useDispatch();
  const fileInput = useRef(null);
  const [caption, setCaption] = useState("## 당신의 제목\n![](당신의-이미지-링크.com)");
  const user = useSelector((state)=>state.user.value);
  const titleRegExp = /(##) ([^\n]+)/g;
  const imageRegExp = /(\!\[\]\()(https?:\/\/[^\s]+)(\))/g;  
  
  const navigate=useNavigate();
  
  

  const uploadPost = ()=>{
    let title, image;
    
    
    const titleMatch = titleRegExp.exec(caption);
    titleRegExp.lastIndex = 0;
    const imageMatch = imageRegExp.exec(caption);
    imageRegExp.lastIndex = 0;
    var languageMatch = [];
    var captionCP = caption;
    
    var timeStart = new Date();
    
    props.languageTable.forEach((each)=>{
      const eachRegExp = new RegExp('(\`\`\`)'+'('+each['Available language mode(s)'].join('|')+')','g');
      const eachMatch = eachRegExp.exec(captionCP);
      if(each['Language'].includes('C'))
        captionCP = captionCP.replace(eachRegExp,'');
      if(eachMatch)
        languageMatch.push(each['Language']);
    })    
    if(!user){      
      dispatch(openAlert('업로드하려면 로그인하세요.'));
      return;
    }
    if(!titleMatch){          
      dispatch(openAlert('업로드하려면 제목이 필요해요!! \n(5번째 버튼으로 제목 생성)'));      
      return;
    }else{
      title = titleMatch[2];
    }
    if(!imageMatch){      
      dispatch(openAlert('업로드하려면 이미지가 필요해요!! \n(10번째 버튼으로 이미지 생성)'));            
      return;
    }else{
      image = imageMatch[2];
    }
    var timeEnd = new Date();
    console.log(timeEnd-timeStart);
    db.collection('posts').add({
      caption:caption,
      imageUrl: image,
      title:title,
      uid:user.uid,
      languages: languageMatch,
      comments:[],
      bookmarkedBy:[]
    }).then(()=>{      
      dispatch(openAlert('업로드가 완료되었습니다!'));      
      navigate(-1);
    }).catch((err)=>{
      alert(err.message);
    })
    
  } 

  const handleFileInput = (e)=>{
    const file = e.target.files[0];        
    uploadImage(file);
  }

  const uploadImage = (file)=>{
    const storageRef = storage.ref();
    const time = Date.now().toString();
    const fileNameRef = storageRef.child(`${user.uid}/postImages/${time+file.name.split('.').pop()}`);    
    fileNameRef.put(file).on('state_changed', snapshot => {
          dispatch(openAlert(['업로드 중입니다...',true]));          
      }, error => {
          alert(error.message);
      }, () => {
          console.log('성공');
          fileNameRef.getDownloadURL().then(url=>{
            setCaption(caption.concat(`\n ![](${url})`))
            dispatch(forceCloseAlert());
          });
      }
    );
  }

  const handlePaste = (e)=>{
    
    const items = (e.clipboardData  || e.originalEvent.clipboardData).items;  
    
    var blob = null;
    for (var i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") === 0) {
        blob = items[i].getAsFile();
      }
    }
    
    if (blob !== null) {
      const file = new File([blob],"name");
      uploadImage(file);
    }
  }

  return (
    <>
      <div className="postUpload__container" data-color-mode="dark">
        <MDEditor
          autoFocus          
          value={caption}
          onChange={setCaption}
          onPaste={handlePaste}
        />
      </div>
      <Button className='postUpload__button' onClick={()=>{uploadPost();}} variant="contained">게시물 업로드</Button>
      <Button className='postUpload__button' variant="contained"  onClick={()=>fileInput.current.click()}>이미지 업로드</Button>
      <input ref={fileInput} type="file" name="file" id='image-upload' onChange={handleFileInput} accept="image/*" style={{display:'none'}}/>
      <div className='app__navigationBtn0Container' >
        <IconButton className='app__navigationBtn0' onClick={()=>navigate(-1)}>
          <KeyboardReturnIcon sx={{fontSize:'40px', color:'#0d1117'}}/>
        </IconButton>
      </div>
    </>
  );
}

export default PostUpload