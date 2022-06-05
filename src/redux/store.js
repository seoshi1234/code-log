import { configureStore, createSlice, getDefaultMiddleware} from '@reduxjs/toolkit';




const postSlice = createSlice({
  name: 'posts',
  initialState:{
    value:[]
  },
  reducers:{
    setPosts: (state, action)=>{
      state.value = action.payload;
    }
  }
})
const postSearchOptionSlice = createSlice({
  name: 'postSearchOption',
  initialState:{
    value:{
      title:'',
      author:'',
      lang:'',
      filteredPosts:[]    
    }
  },
  reducers:{
    setTitle: (state, action)=>{
      state.value.title = action.payload;      
    },
    setAuthor: (state, action)=>{
      state.value.author = action.payload;
    },
    setLang: (state, action)=>{
      state.value.lang = action.payload;
    },
    setFilteredPosts: (state, action)=>{
      state.value.filteredPosts = action.payload;
    },
    filterPosts:(state,action)=>{     
      
      let posts = action.payload;
      
      state.value.filteredPosts=posts.filter((post)=>{        
        let condition = post.author.includes(state.value.author) && post.title.includes(state.value.title);

        if(state.value.lang != ''){
          condition = condition && post.languages.includes(state.value.lang);
        }
        
        return condition;
      });
      
    }
  }
})
const userSlice = createSlice({
  name: 'user',
  initialState:{
    value:null
  },
  reducers:{
    setUser: (state, action)=>{
      state.value = action.payload;
    }
  }
})
const alertModalSlice = createSlice({
  name: 'alertModal',
  initialState:{
    value:{
      text:'',
      opened:false,
      cantClose:false,
    }
  },
  reducers:{
    openAlert: (state, action)=>{             
      if(typeof(action.payload)=='string'){
        state.value.text=action.payload;

      }
      else{
        state.value.text = action.payload[0];
        state.value.cantClose = action.payload[1];        
      }
      state.value.opened=true;
    },
    closeAlert:(state)=>{
      if(state.value.cantClose)
        return;
      
      state.value.opened=false;
    },    
    forceCloseAlert:(state)=>{
      state.value.opened=false;
      state.value.cantClose=false;
    }
  }
})

const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false
})

export const {setPosts} = postSlice.actions;
export const {setUser} = userSlice.actions;
export const {openAlert,closeAlert,forceCloseAlert} = alertModalSlice.actions;
export const {setTitle, setAuthor, setLang,filterPosts,setFilteredPosts} = postSearchOptionSlice.actions;
export default configureStore({
  reducer:{
    posts:postSlice.reducer,    
    user:userSlice.reducer,
    postSearchOption: postSearchOptionSlice.reducer,
    alertModal:alertModalSlice.reducer,    
  },
  middleware:customizedMiddleware,
});