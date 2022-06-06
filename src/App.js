import LandingPage from './Pages/LandingPage.js';
import AlertModal from './Components/AlertModal.js';
import './App.css';
import getLanguageTableAndSet from './Languages.js';
import React,{useState, useEffect, lazy, Suspense} from 'react';
import {db, auth} from './firebase';
import {Routes, Route, Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector,useStore} from 'react-redux';
import {setPosts, setUser,setFilteredPosts} from './redux/store.js';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TerminalIcon from '@mui/icons-material/Terminal';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import Modal from '@mui/material/Modal';
import PostDetail from './Pages/PostDetail.js';


const PostUpload = lazy(()=>import('./Pages/PostUpload.js'));
const PostEdit = lazy(()=>import('./Pages/PostEdit.js'));
const Posts = lazy(()=>import('./Pages/Posts.js'));

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width:'80vw',
  
  bgcolor: 'background.paper',
  border: '2px solid #000',
  borderRadius:'20px',
  boxShadow: 24,
  p: 4,
};
const defaultProfileUrl='https://firebasestorage.googleapis.com/v0/b/code-log-e97b2.appspot.com/o/defaultProfile.png?alt=media&token=0253a9f4-b4e6-4975-ace1-60ad6e7795f1';

function App() {
  //#region hooks
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const store = useStore();
  //#endregion
  //#region states
  const posts = useSelector((state)=>state.posts.value); 
  const postSearchOption = useSelector((state)=>state.postSearchOption.value)   
  const [signUpOpened, setSignUpOpened] = useState(false);
  const [signInOpened, setSignInOpened] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const user = useSelector((state)=>state.user.value);
  const [menuOpened, setMenuOpened] = useState(false);
  const [languageTable, setLanguageTable] = useState([]);
  //#endregion  
  //#region functions
  const openSignUp = () => setSignUpOpened(true);
  const closeSignUp = () => setSignUpOpened(false);
  const openSignIn = () => setSignInOpened(true);
  const closeSignIn = () => setSignInOpened(false);
  
  const signUp = (event)=>{
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser)=>{
      closeSignUp();    
      navigate('/posts');
      db.collection('users').doc(authUser.user.uid).set({
        email:authUser.user.email,
        profileImageUrl:defaultProfileUrl,
        username:username
      })
      return authUser.user.updateProfile({
        displayName: username,
      });
    })
    .catch((error)=>{
      alert(error.message)
      console.log(error)
    })
    
  }

  const signIn = (event)=>{
    event.preventDefault();

    auth.signInWithEmailAndPassword(email,password)
    .then(()=>{
      closeSignIn();    
      navigate('/posts');
    })
    .catch((error)=>{
      alert(error.message);
      console.log(error);
    });    
    
  }

  const toggleSignedIn = ()=>{
    user ? auth.signOut() : openSignIn();
  }
  //#endregion

  //#region callbacks
  useEffect(()=>{
    auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        dispatch(setUser(authUser));                
        if(authUser.displayName){

        }else{
          db.collection('users').doc(authUser.user.uid).update({
            username:username
          })
          return authUser.updateProfile({
            displayName:username,
          })
        }
      }else{
        dispatch(setUser(null));
      }
    })
  },[user,username]);

  const setEachAuthorData =  async (post)=>{
    let user = await (await db.collection('users').doc(post.data().uid).get()).data();

    return Object.assign(post.data(),{author:user.username,profileImageUrl:user.profileImageUrl,id:post.id});
  }

  const processPosts = async (snapshot)=>{
    let postDocs = snapshot.docs;    
    postDocs = await Promise.all(postDocs.map((el,i)=>{      
      return setEachAuthorData(el);
    }))     
    dispatch(setPosts(postDocs))        
    dispatch(setFilteredPosts(postDocs))
  }

  useEffect(()=>{    
    db.collection('posts').onSnapshot(snapshot=>{
      //snapshot: 새로운 게시물이 올라올 때마다, 수정될 때마다 실행됨      
      processPosts(snapshot)          
      
    })
    getLanguageTableAndSet(setLanguageTable);
  },[]);


  //#endregion

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="app" >
      
        <header>
          <div className="app__headerLogo">
            <TerminalIcon className='app__headerLogoIcon'
            sx={{color:'white', fontSize:'30px'}}
            onClick={()=>navigate('/')}
            />
            <p className="app__headerLogoText"
            onClick={()=>navigate('/')}
            >Code.Log{'</>'}</p>
            <IconButton
              onClick={()=>{
                setMenuOpened(!menuOpened)
              }}
              sx={{color:'white'}}
            >
              {
                menuOpened?
                <MenuOpenIcon sx={{color:'white', fontSize:'30px'}}/>
                :
                <MenuIcon sx={{color:'white', fontSize:'30px'}}/>
              }
            </IconButton>
          </div>
          <div className={`app__headerMenu ${menuOpened?'active':''}`}>
            <Button variant="text" onClick={()=>navigate('/posts')}>게시판</Button>
            <Button variant="text" onClick={()=>navigate('/jobs')}>채용정보</Button>
            <Button variant="text" onClick={()=>navigate('/courses')}>웹사이트</Button>            
            <Button variant="text" onClick={()=>navigate('/mypage')}>마이페이지</Button>
      
          </div>
          <div className={`app__headerAuth ${menuOpened?'active':''}`}>
            <Button variant="text" onClick={openSignUp}>계정 만들기</Button>
            <Button variant="text" onClick={toggleSignedIn}>{user?'로그아웃':'로그인'}</Button>
          </div>
      
        </header>
        <div className={`app__headerSpacer ${menuOpened?'active':''}`}>

        </div>
        <Modal
          open={signUpOpened}
          onClose={closeSignUp}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <form className='app__signUp'>
              <center>
                <p>Code.Log{'</>'}</p>
              </center>
              <input
                type="text"
                placeholder='username'
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
              />
              <input
                type="email"
                placeholder='email'
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder='password'
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signUp}>회원가입</Button>
            </form>
          </Box>
        </Modal>
        <Modal
          open={signInOpened}
          onClose={closeSignIn}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <form className='app__signUp'>
              <center>
                <p>Code.Log{'</>'}</p>
              </center>
              <input
                type="email"
                placeholder='email'
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder='password'
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signIn}>로그인</Button>
            </form>
          </Box>
        </Modal>
        <AlertModal/>
        <Routes>
          <Route path='/upload' element={
            <PostUpload languageTable={languageTable}/>
          }/>
          <Route path='/editPost/:id' element={
            <PostEdit languageTable={languageTable}/>
          }
          />
          <Route path='/posts/:id' element={
            <PostDetail/>
          }
          />
          <Route path='/posts' element={
            <Posts languageTable={languageTable}/>
          }/>
          <Route path='/' element={<LandingPage openSignUp={openSignUp}/>}/>          
        </Routes>
      </div>
    </Suspense>
  );
}

export default App;
