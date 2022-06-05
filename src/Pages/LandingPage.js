import React from 'react'
import Button from '@mui/material/Button';
import {useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';

function LandingPage(props) {
  const user = useSelector((state)=>state.user.value);
  const navigate = useNavigate();

  return (
    <div className={`landingPage ${props.menuOpened?'menuOpened':""}`}>
      <h4>당신과 나 사이, 코드저장소</h4>
      <h2>포트폴리오를 관리하고 다른 개발자들과 소통해보세요!</h2>
      {user?
        <Button onClick={()=>navigate('/posts')} variant="contained">시작하기</Button>
        :
        <Button onClick={props.openSignUp} variant="contained">3초만에 가입하기</Button>
      }
      
      <div className="landingPageImage"/>
    </div>
  )
}

export default LandingPage