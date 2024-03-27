import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const BasicModal = ({setShowModal, text, title, showConfirmButton, confirmFunction, flagCloseFunction, closeFunction}) => {
    const closeModal = () => {
        setShowModal(false);
        if (flagCloseFunction) {closeFunction()}
    };
  return (
    <div>
      <Modal
        open={true}
        onClose={() => closeModal()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {title}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {text}
          </Typography>
          <>
             {showConfirmButton ? <Button name='Conferma' type='submit' className='form-button-profile' onClick={confirmFunction}> Confirm </Button> : <></>}
             <Button className='form-button' onClick={() => closeModal()}>Close</Button>
          </>
        </Box>
      </Modal>
    </div>
  );
}

export default BasicModal;