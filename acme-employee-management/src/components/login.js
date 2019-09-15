import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import base from '../airtable';
import md5 from 'md5';

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = props => {
    const classes = useStyles();
    const initialFormState = { id: null, email: '',password: '' }
    const[authenticateState, setAuthenticateState] = useState(false);
    const [ user, setUser ] = useState(initialFormState);
    const handleInputChange = event => {
        const { name, value } = event.target
        setUser({ ...user, [name]: value })
    }

    const fetchIdFromBackend = (user) => {
        var fetchUserData = {};
        var userArray = [];
        base('employees').select({
            maxRecords: 20,
            view: "Grid view"
        }).eachPage(function page(records, fetchNextPage) {
            records.forEach(function(record) {
                var username = record.get('username');
                var roleId = record.get('roleId');
                var password = record.get('encryptedPassword');
                console.log(typeof roleId)
                if(typeof roleId == 'object')
                {
                    if(username != "undefined" || username != undefined){
                        fetchUserData[username] = [roleId[0], password];
                    }
                }
                 
                
            });
            fetchNextPage();
        }, function done(err) {
            if (err) { console.error(err); return; }
        });
        userArray.push(fetchUserData);
        console.log(userArray);

        return new Promise(resolve => {
            setTimeout(
                function() {
                    if(JSON.stringify(Object.keys((userArray[0]))).indexOf(user) != -1)
                    {
                        //resolve(fetchRoleId(userArray[0][userArray[0][user][0]]))
                        //resolve(fetchRoleId(userArray[0][user][0])) //original
                        resolve(validateAuthenticate(userArray[0][user]));

                    }
                    else
                    {
                        alert("User do not exists");
                    }
                },
                3000, userArray[0],user
            );
        });
    }
    const validateAuthenticate = (userCurrent) => {
    
        let encryptPass = (userCurrent[1] != 'undefined') ? userCurrent[1] : "";
        console.log(encryptPass, user.password)
        console.log("user",user);
        
        let hashPass = md5(user.password);
        console.log("encrypt", hashPass, encryptPass)
        if(hashPass == encryptPass)
        {
            if(fetchRoleId(userCurrent[0])){
                setAuthenticateState(true);
                localStorage.setItem('user', user.email);
                props.history.push('/home');
                return true;
            }
            else
            {
                alert("User Not Admin");
            }
        }
        else{
            alert("Password Do Not Match.");
            setAuthenticateState(false);
        }
    }
    
    const fetchRoleId = (roleId) => {
        console.log(roleId);
        var roleData = {"rec8LvPhlItUIXzSH": true, "recgX2h2scCELqjQv" :false}
        return roleData[roleId];

    }
    
    async function handleLogin(e){
        e.preventDefault();
        console.log(user.email); 
        var isAdmin = await fetchIdFromBackend(user.email);
        if(authenticateState)
        {
            localStorage.setItem('user', user.email);
            props.history.push('/home');
        }
        else{
            //alert("Invalid Login: You are not Admin.");
        }
        //localStorage.setItem('user', user.email);
    };
      return (
            <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                Sign in
                </Typography>
                <form className={classes.form} noValidate>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    value={user.email}
                    autoComplete="email"
                    onChange={handleInputChange}
                    autoFocus
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    value={user.password}
                    onChange={handleInputChange}
                    type="password"
                    id="password"
                    autoComplete="current-password"
                />
                <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClickCapture ={handleLogin}
                >
                    Sign In
                </Button>
                </form>
            </div>
            </Container>
      );
    }

export default Login;