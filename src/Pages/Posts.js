import React, { useEffect, useState } from 'react'
import { setFilteredPosts,filterPosts } from '../redux/store.js';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';
import {useSelector,useDispatch} from 'react-redux';
import {db} from '../firebase.js';
import PostThumbnail from '../Components/PostThumbnail.js';
import PostSearch from '../Components/PostSearch.js';

function Posts(props) {
  const dispatch = useDispatch();
  const posts = useSelector((state)=>state.posts.value);  
  const filteredPosts = useSelector((state)=>state.postSearchOption.value.filteredPosts);
  const navigate = useNavigate();
  const [renderedPosts,setRenderedPosts] = useState([]);
  const [searchOpened,setSearchOpened] = useState(false);
  
  useEffect(()=>{    
    dispatch(setFilteredPosts(posts));
    setRenderedPosts([...posts]);
    
  },[posts])

  useEffect(()=>{
    setRenderedPosts([]);
    setRenderedPosts([...filteredPosts])
    console.log(renderedPosts);
  },[filteredPosts])

  return (
    <div>      
      <div className="posts__container">
        {
          renderedPosts.map((post,i)=>{
            console.log(post.author);
            return(
              <PostThumbnail key={i} post={post} idx={i}/>
            )
          })
        }
      </div>
      <div className='app__navigationBtn0Container' >
        <IconButton className='app__navigationBtn0' onClick={()=>navigate('/upload')}>
          <AddIcon sx={{fontSize:'40px', color:'#0d1117'}}/>
        </IconButton>
      </div>
      <div className='app__navigationBtn0Container' style={{bottom:'100px'}}>
        <IconButton className='app__navigationBtn0' onClick={()=>setSearchOpened(!searchOpened)}>
          <SearchIcon sx={{fontSize:'40px', color:'#0d1117'}}/>
        </IconButton>
      </div>
      
      <PostSearch searchOpened={searchOpened} languageTable={props.languageTable} posts={posts} closeSearch={()=>setSearchOpened(false)}/>
    </div>
  )
}

export default Posts