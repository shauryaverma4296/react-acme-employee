import React, { useState, useEffect } from "react"
import Header from "./header"
import { makeStyles } from '@material-ui/core/styles';
import {Table, TableBody, TableCell, TableHead, TableRow, Paper, Dialog, DialogContent, DialogTitle, Button, DialogActions, FormControl, TextField } from '@material-ui/core';
import base from '../airtable';
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete';


const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing(3),
      overflowX: 'auto',
    },
    table: {
      minWidth: 650,
    },
}));


const employeeModal = (props) => {
    const handleClose = () => {
        props.setOpen(false);
    };
    const classes = useStyles();
    <Dialog  aria-labelledby="customized-dialog-title" open={open} onClose ={handleClose}>
        <DialogTitle id="customized-dialog-title" >
        {props.editing ? (  <div>Edit Employee Dialog</div> ): ( <div>Add Employee Dialog</div> ) }
        </DialogTitle>
        <DialogContent dividers>
            <form className={classes.container} noValidate autoComplete="off">
                <TextField
                    id="standard-name"
                    label="First Name"
                    className={classes.textField}
                    value={values.name}
                    onChange={handleChange('name')}
                    margin="normal"
                />
                <TextField
                    id="standard-name"
                    label="Last Name"
                    className={classes.textField}
                    value={values.name}
                    onChange={handleChange('name')}
                    margin="normal"
                />
                <TextField
                    id="standard-select-currency"
                    select
                    label="Select"
                    className={classes.textField}
                    value={values.currency}
                    onChange={handleChange('currency')}
                    SelectProps={{
                    MenuProps: {
                        className: classes.menu,
                    },
                    }}
                    helperText="Please select your currency"
                    margin="normal"
                >
                    {currencies.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                    ))}
                </TextField>
                
                <TextField
                    id="standard-number"
                    label="Number"
                    value={values.age}
                    onChange={handleChange('age')}
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
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label="Date picker inline"
                        value={selectedDate}
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
        <Button  color="primary">
            Save changes
        </Button>
        </DialogActions>
    </Dialog>
}

export default employeeModal;