import React,{useEffect, useState,useRef} from 'react'
import {useParams,useNavigate} from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { IconButton } from '@mui/material';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import Modal from '@mui/material/Modal';
import {db,storage} from '../firebase';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {openAlert,forceCloseAlert} from '../redux/store.js';
import './PostUpload.css';

function PostEdit(props) {
  const param = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInput = useRef(null);
  const [caption, setCaption] = useState("");
  const [authorId, setAuthorId] = useState('');  
  const user = useSelector((state)=>state.user.value);
  const titleRegExp = /(##) ([^\n]+)/g;
  const imageRegExp = /(\!\[\]\()(https?:\/\/[^\s]+)(\))/g;
  
  
  
  useEffect(()=>{
    db.collection('posts').doc(param.id).get().then(snapshot=>{
      setCaption(snapshot.data().caption);
      setAuthorId(snapshot.data().uid);
    })    
    

  },[]);

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
      dispatch(openAlert('수정하려면 로그인하세요.'));
      return;
    }
    if(user.uid != authorId){
      dispatch(openAlert('수정권한이 없습니다.'));
      return;
    }
    if(!titleMatch){          
      dispatch(openAlert('수정하려면 제목이 필요해요!! \n(5번째 버튼으로 제목 생성)'));
      return;
    }else{
      title = titleMatch[2];
    }
    if(!imageMatch){      
      dispatch(openAlert('수정하려면 이미지가 필요해요!! \n(10번째 버튼으로 이미지 생성)'));
      return;
    }else{
      image = imageMatch[2];
    }
    var timeEnd = new Date();
    console.log(timeEnd-timeStart);
    db.collection('posts').doc(param.id).update({
      caption:caption,
      imageUrl: image,
      title:title,
      uid:user.uid,
      languages: languageMatch,
    }).then(()=>{      
      dispatch(openAlert('수정이 완료되었습니다!'));      
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
      <Button className='postUpload__button' onClick={()=>{uploadPost();}} variant="contained">게시물 수정</Button>      
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

export default PostEdit