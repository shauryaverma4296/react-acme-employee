import React, { useState, useEffect } from "react"
import { makeStyles } from '@material-ui/core/styles';
import {Dialog, DialogContent, DialogTitle, Button, DialogActions } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import base from "../../airtable"

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
  container: {
      display: "flex",
      flexWrap: "wrap"
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200
    },
    dense: {
      marginTop: 19
    },
    menu: {
      width: 200
    }
}));

const EditUserForm = (props) =>
{
  
  const classes = useStyles();
  
  const [user, setUser] = useState(props.currentUser[0]);
  const[newId, setNewId] = useState('');
  console.log("initailModal/Update",user);
  //console.log("while updating", user)
  const handleChangeEmployeeEdit = event => {
    const { name, value } = event.target;
    //update is not happening for the first case
    setUser({ ...user, [name]: value });
    
  };

  useEffect(
    () => {
      setUser(props.currentUser[0]);
      //setSelectedDate(props.currentUser.startDate);
     
    },
    [props.currentUser[0],]
  );

  // useEffect(
  //   () => {
  //     console.log(newId);
  //     console.log(user);
  //     setUser({ ...user, id: newId });
  //     console.log("AFTER USEEFFECT",user);
  //   },
  //   [newId]
  // )
 
  function updateEmployee  () {
  
    console.log(user);
    if(props.editing)
    {
      base('employees').update([
        {
          "id": user.id,
          "fields": {
            "firstName": user.firstName,
            "lastName": user.lastName,
            "positionTypeId": [
              user.employeePostion
            ],
            "startDate": user.startDate,
            "salary": parseInt(user.salary),
            "encryptedPassword" : "0192023a7bbd73250516f069df18b500"
          }
        }
      ], function(err, records) {
        if (err) {
          console.error(err);
          return;
        }
        records.forEach(function(record) {
          console.log(record); //issue record is not inserting in the map
          props.updateUser(record.id, user);
        });
      });
    }
    else{
      //add a new record
      base('employees').create([
        {
          "fields": {
            "username": user.firstName,
            "firstName": user.firstName,
            "lastName": user.lastName,
            "positionTypeId": [
              user.employeePostion
            ],
            "startDate": user.startDate,
            "salary": parseInt(user.salary),
            "roleId":[
              "recgX2h2scCELqjQv"
            ]
          }
        }
      ],  function(err, records) {
        if (err) {
          console.error(err);
          return;
        }
        records.forEach(function (record) {
          console.log("before records ",user);
         // updateSync(record.id);
          //setUser({ ...user, id: record.id })
          //setNewId(record.id);
          user['id'] = record.id;
          props.updateUser(record.id, user);
          console.log("AFter response",user)
        });
      });
      //////
    }
  }

  async function updateSync(id){
    //let resp = await setUser({ ...user, ['id']: id })
    //console.log("#async", user)
   // await resp props.updateUser(id, user);
  }
  //fetch intial Data of the Employee Postion Data
 

  const [selectedDate, setSelectedDate] = useState(new Date('2014-08-18T21:11:54'));

  function handleDateChange(date) {
    console.log(date)
    setSelectedDate(date);
    setUser({ ...user, ['startDate']: new Date(date).toString() }); //still need to fix date issue
  }
  return(
      <Dialog  aria-labelledby="customized-dialog-title" open={props.openModal} onClose ={props.handleClose}>
        <DialogTitle id="customized-dialog-title" >
        { props.editing ? (<span>Edit Employee Dialog</span>) : <span>Add Employee Dialog</span> }
        </DialogTitle>
        <DialogContent dividers>
            <form className={classes.container} noValidate autoComplete="off">
                <TextField
                    id={"standard-name"+user.id}
                    label="First Name"
                    className={classes.textField}
                    value={ user.firstName}
                    name="firstName"
                    onChange={handleChangeEmployeeEdit}
                    margin="normal"
                />
                <TextField
                    id={"standard-lastName"+user.id}
                    label="Last Name"
                    className={classes.textField}
                    value={ user.lastName}
                    name="lastName"
                    onChange={handleChangeEmployeeEdit}
                    margin="normal"
                />
                <TextField
                    id={"standard-select-employeePosition"+user.id}
                    select
                    label="Select"
                    name="employeePostion"
                    className={classes.textField}
                    value={ user.employeePostion}
                    onChange={handleChangeEmployeeEdit}
                    SelectProps={{
                    MenuProps: {
                        className: classes.menu,
                    },
                    }}
                    helperText="Please select Employee Position"
                    margin="normal"
                >
                    {props.employeePositionIntial.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                    ))}
                </TextField>
                
                <TextField
                    id={"standard-number"+user.id}
                    label="Number"
                    value={ user.salary}
                    name="salary"
                    onChange={handleChangeEmployeeEdit}
                    type="number"
                    className={classes.textField}
                    InputLabelProps={{
                    shrink: true,
                    }}
                    margin="normal"
                />
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                    <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="yyyy/MM/dd"
                        margin="normal"
                        id={"date-picker-inline"+user.id}
                        label="Date picker inline"
                        name="startDate"
                        value={user.startDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                        'aria-label': 'change date',
                        }}
                    />
                    </Grid>
                </MuiPickersUtilsProvider>
                
            </form>
        </DialogContent>
        <DialogActions>
        <Button onClickCapture={updateEmployee}  color="primary">
            Save changes
        </Button>
        </DialogActions>
    </Dialog>
    );
  
  
}
        

export default EditUserForm;