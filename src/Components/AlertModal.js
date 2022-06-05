import React,{useState} from 'react'
import { useSelector,useDispatch } from 'react-redux';
import { openAlert,closeAlert } from '../redux/store';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

function AlertModal() {
  const dispatch = useDispatch()
  
  const alertModal = useSelector((state)=>state.alertModal.value);


  const modalSX = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60vw',
    bgcolor: 'background.paper',  
    borderRadius:'20px',
    boxShadow: 24,
    p: 4,
    
  };

  const modalStyle={
    whiteSpace:'pre-line',

  }


  return (
    <Modal
        className='alertModal'
        style={modalStyle}
        open={alertModal.opened}
        onClose={()=>dispatch(closeAlert())}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
      <Box sx={modalSX}>
        <p>{alertModal.text}</p>
      </Box>
    </Modal>
  )
}

export default AlertModal