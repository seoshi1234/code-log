import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import './PostDetail.css'
import {useParams, Link,useNavigate} from 'react-router-dom';
import { IconButton } from '@mui/material';
import {Button}from '@mui/material'
import CommentIcon from '@mui/icons-material/Comment';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import {db,arrayUnion,arrayRemove, Timestamp} from '../firebase';
import MDEditor from '@uiw/react-md-editor';
import EachComment from '../Components/EachComment';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  borderRadius:'20px',
  boxShadow: 24,
  p: 4,
  
};

function PostDetail() {
  const param = useParams();
  const navigate = useNavigate()
  const user = useSelector(state=>state.user.value);     
  var postRef = db.collection('posts').doc(param.id);
  const [userProfile, setUserProfile] = useState('');
  const [value,setValue] = useState('');
  const [author, setAuthor] = useState('');
  const [languages, setLanguages] = useState([]);  
  const [comments, setComments] = useState([]);
  const [commentUserData, setCommentUserData] = useState([]);  
  let commentCaption = '';
  const commentRef = useRef(null);
  const [bookmarkedBy, setBookmarkedBy] = useState([]);
  const [isBookmarked,setIsBookmarked] = useState(false);
  const [commentsOpened, setCommentsOpened] = useState(false);

  const closeComments = ()=>{
    setCommentsOpened(false);
  }

  const uploadComment = ()=>{
    if(commentCaption == ''){
      return;
    }
    const newComment = {uid:user.uid,caption:commentCaption, date:Timestamp.fromDate(new Date())};
    setComments([...comments,newComment])
    postRef.update({comments:arrayUnion(newComment)})
    .then(()=>{
      postRef.get().then(snapshot=>{
        setComments(snapshot.get('comments'));
      })
    })
  }

  const deleteComment = (comment)=>{
    let cloneArr = [...comments];
    cloneArr.splice(cloneArr.indexOf(comment),1);
    setComments(cloneArr);
    postRef.update({comments:arrayRemove(comment)})
    .then(()=>{
      postRef.get().then(snapshot=>{
        setComments(snapshot.get('comments'));
      })
    })
  }
  
  const toggleBookmark = ()=>{        
    if(isBookmarked){    
      let cloneArr = [...bookmarkedBy];
      cloneArr.splice(cloneArr.indexOf(user.uid),1)      
      setBookmarkedBy(cloneArr);
      postRef.update({bookmarkedBy:arrayRemove(user.uid)})
      .then(()=>{
        postRef.get().then(snapshot=>{
          setBookmarkedBy(snapshot.data().bookmarkedBy);
        });
        db.collection('users').doc(user.uid).update({bookmarks:arrayRemove(param.id)});
      });
    }else{      
      setBookmarkedBy([...bookmarkedBy,user.uid]);
      postRef.update({bookmarkedBy:arrayUnion(user.uid)})
      .then(()=>{
        postRef.get().then(snapshot=>{
          setBookmarkedBy(snapshot.data().bookmarkedBy);
        })
        db.collection('users').doc(user.uid).update({bookmarks:arrayUnion(param.id)});
      });
    }
    setIsBookmarked(!isBookmarked);
  };

  
  useEffect(()=>{    
    db.collection('users').doc(user?.uid).get().then(snapshot=>{
      
      setUserProfile(snapshot.get('profileImageUrl'));
    });
    postRef = db.collection('posts').doc(param.id);
    postRef.get().then(snapshot=>{      
      const post = snapshot.data();
      setValue(post.caption);
      setLanguages(post.languages);    
      setComments(post.comments);
      setBookmarkedBy(post.bookmarkedBy);
      setIsBookmarked(post.bookmarkedBy.includes(user?.uid));
      db.collection('users').doc(post.uid).get().then(snapshot=>{
        setAuthor(snapshot.data().username);
      })      
    });    
    
  },[user]);


  const getEachUserData =  async (uid)=>{
    return (await db.collection('users').doc(uid).get()).data();
  }

  const getCommentUserData = async ()=>{
    setCommentUserData(
      await Promise.all(comments.map((el,i)=>{
        return getEachUserData(el.uid);
      })) 
    );
  }

  useEffect(()=>{    
    getCommentUserData();
  },[comments])

  useEffect(()=>{
    console.log(commentUserData);
  },[commentUserData])
  
  return (
    <div className='postDetail' data-color-mode="dark">
      <div className="postDetail__topInfo">
        <Link className='postDetail__link' to={'/'}>작성자: {author}</Link>      
        <div className="postDetail__topInfo__rightSection">
          <div>
            <IconButton sx={{color:'white'}} onClick={toggleBookmark}>
              {
                isBookmarked?
                <BookmarkIcon sx={{color:'white'}}/>:
                <BookmarkBorderIcon sx={{color:'white'}}/>
              }
            </IconButton>
            • {bookmarkedBy?.length}개
          </div>
          <div>
            <IconButton sx={{color:'white'}} onClick={()=>setCommentsOpened(true)}>
              <CommentIcon sx={{color:'white'}}/>
            </IconButton>
            • {comments?.length}개
          </div>
        </div>
      </div>
      {
        languages?.length == 0?
        <></>:
        <div className="postDetail__languageInfo">
          <p>사용된 언어: </p>
          {languages&&languages.map((a,i)=>{          
            return(
              <div key={i} className="postDetail__languageBlock">
                {a}
              </div>
            );
          })}
        </div>
      }
      <MDEditor.Markdown source={value} className='postDetail__content' />
      <Modal
          open={commentsOpened}
          onClose={closeComments}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <p>댓글</p>
            <hr />
            <div className="postDetail__commentsContainer">
              {
                comments.length==0?
                <div className='postDetail__noComment'>댓글이 아직 없어요!</div>
                :
                comments.map((el,i)=>{
                  return(
                    <EachComment deleteComment={deleteComment} el={el} userUID={user?.uid} commentUserData={commentUserData[i]} key={i}/>
                  );
                })
              }
            </div>
            <hr />
            <div className='postDetail__commentForm' >
              <div className='postDetail__commentForm__leftSection' style={{backgroundImage:`url(${userProfile})`}}></div>
              <div className="postDetail__commentForm__rightSection">
                <TextareaAutosize placeholder='댓글 추가...' onChange={(e)=>{
                  commentCaption=e.target.value;
                }} ></TextareaAutosize>
                <Button  onClick={uploadComment}>게시</Button>
              </div>
            </div>
            
          </Box>
        </Modal>
      <div className='app__navigationBtn0Container' >
        <IconButton className='app__navigationBtn0' onClick={()=>navigate(-1)}>
          <KeyboardReturnIcon sx={{fontSize:'40px', color:'#0d1117'}}/>
        </IconButton>
      </div>
      <div className='app__navigationBtn0Container' style={{bottom:'100px'}}>
        <IconButton className='app__navigationBtn0' onClick={()=>window.scrollTo(0,0)}>
          <KeyboardArrowUpIcon sx={{fontSize:'40px', color:'#0d1117'}}/>
        </IconButton>
      </div>
    </div>
  )
}

export default PostDetail;