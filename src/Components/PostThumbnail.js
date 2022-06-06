import React, { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import {db} from '../firebase.js'
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import './PostThumbnail.css'
import { useSelector } from 'react-redux';



function PostThumbnail(props) {
    
  const user = useSelector(state=>state.user.value);
  const navigate = useNavigate();  


  return (
    <div className={`postThumbnail ${user?.uid==props.post.uid?'isOwner':''}`}
    style={{backgroundImage:`url(${props.post.imageUrl})`}}
    onClick={(e)=>{ navigate(`/posts/${props.post.id}`);}}      
    >          
      <div className="postThumbnail__UIWrapper">
        <div className="postThumbnail__titleWrapper">
          <p className="postThumbnail__title">
            {props.post.title}
          </p>
        </div>
        
        <div className={`postThumbnail__editBtnContainer`} >
          <IconButton className='postThumbnail__editBtn' onClick={(e)=>{e.stopPropagation(); navigate(`/editPost/${props.post.id}`)}}>
            <EditIcon sx={{fontSize:'81%', color:'#0d1117'}}/>
          </IconButton>
        </div>
        <div className="postThumbnail__profile">
          <div className="postThumbnail__profileImage" style={{backgroundImage:`url(${props.post.profileImageUrl})`}}/>
          <p className="postThumbnail__username">
            {props.post.author}
          </p>
        </div>
      </div>  
    </div>      
  )
}

export default PostThumbnail