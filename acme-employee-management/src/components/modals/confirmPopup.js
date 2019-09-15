import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';

function PaperComponent(props) {
  return (
    <Draggable cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

export default function DraggableDialog() {
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const handleClickOpen = () => {
    setOpenConfirmDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenConfirmDelete(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          Delete Employee
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete employee "Admin" ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteClose} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
