import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import './PostSearch.css'
import { db } from '../firebase';
import { setTitle,setAuthor,setLang,filterPosts } from '../redux/store';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

function PostSearch(props) {
  const dispatch = useDispatch();  
  const [languageTable,setLanguageTable] = useState([]);
  const onSearch=()=>{
    dispatch(filterPosts([...props.posts]));
  }

  useEffect(()=>{
    setLanguageTable(props.languageTable)    
  },[props.languageTable,languageTable])


  return (
    <div className={`postSearch__container ${
      props.searchOpened?'':'disabled'
    }`}
    onKeyUp={(e)=>{
      onSearch();
      if(e.key==="Enter"){
      }
    }}
    >
      <div>
        <input onChange={(e)=>{dispatch(setTitle(e.target.value))}} type="search" placeholder='제목으로 검색' className="postSearch__titleInput"/>
        <IconButton onClick={onSearch}>
          <SearchIcon sx={{fontSize:'30px', color:'#0d1117'}}/>
        </IconButton>
        <IconButton className='postSearch__exitBtn'
        onClick={props.closeSearch}>
          <CloseIcon  sx={{fontSize:'30px', color:'#0d1117'}}/>
        </IconButton>
      </div>
      <div>
        <input onChange={(e)=>dispatch(setAuthor(e.target.value))} type="search" placeholder='작성자로 검색' className='postSearch__authorInput'/>
        <select onChange={(e)=>{dispatch(setLang(e.target.value)); onSearch()}} className='postSearch__authorInput' >
          <option value="">사용된 언어로 검색</option>
          {
            languageTable.map((el,i)=>{
              return <option value={el.Language} key={i}>{el.Language}</option>
            })
          }
          
        </select>        
        
      </div>
    </div>
  )
}

export default PostSearch