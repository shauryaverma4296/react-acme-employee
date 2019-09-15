import React, { useState, useEffect } from "react"
import { makeStyles } from '@material-ui/core/styles';
import {Table, TableBody, TableCell, TableHead, TableRow, Paper, Dialog, DialogContent, DialogTitle, DialogContentText, Button, DialogActions, IconButton, SnackbarContent, Snackbar, Fab } from '@material-ui/core';
import Draggable from 'react-draggable';
import base from '../airtable';
import clsx from 'clsx';
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete';
import EditUserForm from "./modals/modal";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import CloseIcon from "@material-ui/icons/Close";
import AddIcon from '@material-ui/icons/Add';
import { amber, green } from "@material-ui/core/colors";

const useStyles = makeStyles(theme => ({
    root: {
      width: '88%',
      marginTop: theme.spacing(3),
      marginLeft:theme.spacing(10),
      overflowX: 'auto',
    },
    table: {
      minWidth: 650,
    },
    container: {
        display: "flex",
        flexWrap: "wrap"
      },
    margin: {
        margin: theme.spacing(1),
    },
    success: {
        backgroundColor: green[600]
    },
    icon: {
        fontSize: 20
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1)
    },
        message: {
        display: "flex",
        alignItems: "center"
    },
    fab: {
        
        marginTop: theme.spacing(4),
        marginLeft : theme.spacing(10),
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
        
    },
}));

function PaperComponent(props) {
    return (
      <Draggable cancel={'[class*="MuiDialogContent-root"]'}>
        <Paper {...props} />
      </Draggable>
    );
  }

const Home = () => {
    const classes = useStyles();
    
    
    //edit User 
    const [editing, setEditing] = useState(false);
    let initialDate = new Date('2014-08-18T21:11:54');
    let initialDateToString = initialDate.toString();
    //edit Modal state
    const initialFormState = [{ id: '', firstName: '', lastName: '', employeePostion: '', startDate: initialDateToString, salary: '' }];

    const [currentUser, setCurrentUser] = useState(initialFormState);

    //During Home page load
    const [ employee, setEmployee ] = useState([]);
    
    //-------------------------*******For Alert Popups--------------------------------
        const variantIcon = {
            success: CheckCircleIcon,
            // warning: WarningIcon,
            error: ErrorIcon,
            info: InfoIcon
        };
        
        const [openAlert, setAlertOpen] = React.useState(false);

        function handleAlertClick() {
            setAlertOpen(true);
        }

        function handleAlertClose(event, reason) {
            if (reason === "clickaway") {
            return;
            }
            setAlertOpen(false);
        }

        function MySnackbarContentWrapper(props) {
            const { className, message, onClose, variant, ...other } = props;
            const Icon = variantIcon[variant];
          
            return (
              <SnackbarContent
                className={clsx(classes[variant], className)}
                aria-describedby="client-snackbar"
                message={
                  <span id="client-snackbar" className={classes.message}>
                    <Icon className={clsx(classes.icon, classes.iconVariant)} />
                    {message}
                  </span>
                }
                action={[
                  <IconButton
                    key="close"
                    aria-label="close"
                    color="inherit"
                    onClick={onClose}
                  >
                    <CloseIcon className={classes.icon} />
                  </IconButton>
                ]}
                {...other}
              />
            );
          }

    //-------------------------*******End For Alert Popups--------------------------------

    //-------------------------*******For Confirm Delete-------------------------------
        const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
        const [deleteId, setDeleteId] = useState('');

        const handleDeleteClose = () => {
            setOpenConfirmDelete(false);
        };
        const handleDelete = (id) =>{
            setOpenConfirmDelete(true);
            setDeleteId(id);
        }

        const handleDeleteCofirmed = () => {
            console.log(deleteId);
            base('employees').destroy([deleteId], function(err, deletedRecords) {
                if (err) {
                  console.error(err);
                  return;
                }
                console.log('Deleted', deletedRecords.length, 'records');

                if(validator(employee,0))
                {
                    let employeeIndex = employee.findIndex((updateUser => updateUser.id == deleteId));
                    let currentEmployee = validator(employee, employeeIndex)
                    ?  (employeeIndex === -1 ) 
                    ?   alert("Record Does not exists!") 
                        : employee.splice(employeeIndex,1)
                    : employee;
                }

                setEmployee(employee);
                setOpenConfirmDelete(false);
                // if(typeof employee == 'object' ){

                //     let employeeIndex = employee.findIndex((updateUser => updateUser.id == deleteId));
                //     if(employee.length() < employeeIndex){
                //         if (employeeIndex === -1 ) {
                //             alert("Record Does not exists!")
                //         } else {
                //             employee.splice(employeeIndex,1);
                //         }
                //     }
                // }
              });
        }

        const validator = (arr, index) => {
            if(typeof employee == 'object' ){
                return (0 <= index < arr.length);
            }
            else{
                return false;
            }
        }

        
    //-------------------------*******End For Confirm Delete-------------------------------


    // Modal State and function
    const [open, setOpen] = useState(false);

    const handleClickOpen = (id) => {
        setOpen(true);
        if(id != ''){
            setEditing(true);
            fetchEditEmployeeData(id);
        }
        else{
            setEditing(false);
            setCurrentUser(initialFormState);
        }
        fetchEmployeePositionIntialData();  
        
    };
    
    const handleClose = () => {
        setCurrentUser(initialFormState);
        setOpen(false);
    };
    // End of Modal State and function

//intial value used to fetch the data
    const employeePosition = [ { value: "", label: "" } ];
    const [employeePositionIntial, setInitalEmployeePosition] = useState(employeePosition);

    const[onLoadPosition, setOnLoadPosition] = useState({});
    
    const updateUser = (id, updateUser) => {
        //setOpen(false);
        setEditing(false);
        //setEmployee(employee.map(employeeVal => (employeeVal.id === id ? updateUser : employee)));
        console.log("#after update ", employee);
        console.log("after Updating",id);
        let employeeIndex = employee.findIndex((updateUser => updateUser.id == id));
        if (employeeIndex === -1) {
            employee.push(updateUser);// use spread operator
            handleAlertClick();
        } else {
            console.log(employee);
            employee[employeeIndex] = updateUser;
        }
        //setEmployee(employee);
        console.log("#newApproach", employee);
        setOpen(false);
        
      };
     // fetchEmployeePositionIntialData();
    useEffect( () => {
        async function fetchRecords(){
            let employee_data = [];
            await base('employees').select({
                maxRecords: 30,
                view: "Grid view",
                fields: ["username", "firstName","lastName","positionTypeId","startDate","salary"]
            }).eachPage(function page(records, fetchNextPage) {
                records.forEach(function(record) {
                    if(record.fields.hasOwnProperty('positionTypeId')){

                    //if(record.get('positionTypeId')){
                        //let employee_role = fetchEmployeeRoles(record.fields.positionTypeId[0]);
                        //let positionIndex = employeePositionIntial.findIndex((position => updateUser.id == id));
                        /* let positonData = new Promise(resolve => {
                            base('employee_positions').find(record.fields.positionTypeId[0], function(err, recordEmployeeRole){
                                resolve(recordEmployeeRole.fields.label) ;
                            });
                         
                       }).then(function(data){
                           console.log("#Data",data);
                       }); */
                        //let positonData = fetchEmployeeRoles(record.fields.positionTypeId[0]);
                        employee_data.push({ 'id': record.id, 'firstName': record.get('firstName'), 'lastName': record.get('lastName'), 'employeePostion': record.fields.positionTypeId[0], 'startDate':record.get('startDate'), 'salary': record.get('salary') });
                    }
                    else{
                        console.log("Field Is Empty"); //still need to verify and validate
                    }
                    
                });
                fetchNextPage();

                new Promise (resolve => {
                    resolve(setEmployee (employee_data));
                });
            }, 
            function done(err) {
                if (err) { console.error(err); return; }
            }); 
        }
        fetchRecords();    
    }, []);
// for edit render data in modal
    async function fetchEditEmployeeData(id){ 
        await base('employees').find(id, function(err, record) {
            if (err) { console.error(err); return; }
            setCurrentUser([{ id: id, firstName: record.fields.firstName, lastName: record.fields.lastName, employeePostion: record.fields.positionTypeId[0], startDate:record.fields.startDate, salary: record.fields.salary  }])
            
            
        });
    
    }
// will use to select in edit modal
    function fetchEmployeeRoles (employeeId) {
        let roleIdObj = {"recrRNFkPHN42RZqB" : "Account Manager" ,"rec0QzkoTexq0Paxp" : "Owner" ,"rechyjicbPOFmC7QU" : "Engineer"};
        return roleIdObj[employeeId];
    }

    function getDate(val){
        var d = new Date(val);
        return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
    }
    
//Add New User 

// const addUser = user => {
//     user.id = users.length + 1
//     setUsers([...users, user])
//   }


//Fetching Intial Employee Position data
async function fetchEmployeePositionIntialData() 
{
    let initalPostionRespData = [];
    await base('employee_positions').select({
        maxRecords: 20,
        view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {       
        records.forEach(function(record) {
            let postiondata = {value: record.id, label: record.get('label')} ;
            initalPostionRespData.push(postiondata);
            
        });
        setInitalEmployeePosition(initalPostionRespData);
        fetchNextPage();
    
    }, function done(err) {
        if (err) { console.error(err); return; }
    });
    
}


    return (
        <div>
            <Fab color="primary" size="small" aria-label="add" className={classes.fab} onClickCapture={handleClickOpen.bind(null, '')}>
                <AddIcon />
            </Fab>
            <Paper className={classes.root}>
                <Table className={classes.table}>
                <TableHead>
                    <TableRow >
                    <TableCell>First Name</TableCell>
                    <TableCell align="center">Last Name</TableCell>
                    <TableCell align="center">Position</TableCell>
                    <TableCell align="center">Start Date</TableCell>
                    <TableCell align="center">Salary</TableCell>
                    <TableCell align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {employee.map(record => (
                        <TableRow key={record.id}>
                            <TableCell component="th" scope="row">{record.firstName}</TableCell>
                            <TableCell align="center">{record.lastName}</TableCell>
                            <TableCell align="center">{fetchEmployeeRoles(record.employeePostion)}</TableCell>
                            <TableCell align="center">{getDate(record.startDate)}</TableCell>
                            <TableCell align="center">{record.salary}</TableCell>
                            <TableCell align="center">
                                <span>
                                    <Button color="primary" onClickCapture={handleClickOpen.bind(null, record.id)}> <SettingsIcon /> 
                                    </Button>
                                </span>
                                <span>
                                    <Button color="primary" onClickCapture={handleDelete.bind(null, record.id)}> 
                                        <DeleteIcon />
                                    </Button>
                                </span>
                            </TableCell>
                            
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
            </Paper>
            <EditUserForm 
                    currentUser = {currentUser} 
                    editing     = {editing}
                    setEditing  = {setEditing} 
                    openModal   = {open} 
                    handleClose = {handleClose}
                    employeePositionIntial = {employeePositionIntial}
                    updateUser = {updateUser}
            />
            <Snackbar
                anchorOrigin={{
                vertical: "bottom",
                horizontal: "left"
                }}
                open={openAlert}
                autoHideDuration={6000}
                onClose={handleAlertClose}
            >
                    <MySnackbarContentWrapper
                    onClose={handleAlertClose}
                    variant="success"
                    message="The Employee Updated!"
                    />
            </Snackbar>
            <Dialog
                open={openConfirmDelete}
                onClose={handleDeleteClose}
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
                    <Button onClick={handleDeleteClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteCofirmed} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>            
    );
}




// const Home = () => { 
//     return (
//         <div>
//             <Header />
//             <SimpleTable />
//         </div>
//     )
// }

export default Home;