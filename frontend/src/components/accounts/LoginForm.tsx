import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
// We also support Valibot, ArkType, and any other standard schema library
import { z } from 'zod'

import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage, type AuthProvider } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';
import { Button, Popper } from '@mui/material';
import { postLogin } from '../../api/axiosConfig.tsx';
import { useState } from 'react';
import type{ User } from '../../types/User.ts';
import api from "../../api/axiosConfig.tsx"
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import {Icon} from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye'
import TextField from '@mui/material/TextField';
import MenuIcon from '@mui/icons-material/Menu';
import { SearchBox } from '../search/SearchBox.tsx';
// preview-start



// fetch account data



// search for data match with username and password
// login


// Allow us to bind components to the form to keep type safety but reduce production boilerplate
// Define this once to have a generator of consistent form instances throughout your app



export default function LoginForm() {


// user States
const [userInfo, setUserInfo] =useState<User>({})
const [showLoginUserMenu,setShowLoginUserMenu] = useState(false);
const [loginToken,setLoginToken] = useState("");


// user card main menu
const [showUserCardMainMenu,setShowUserCardMainMenu] = useState(false);
const [userCardMainMenuanchorEl, setuserCardMainMenuAnchorEl] = React.useState<HTMLButtonElement | null>(null);
const userMainMenuOpen = Boolean(userCardMainMenuanchorEl);
const userMainMenuId = userMainMenuOpen ? 'simple-popover' : undefined;

// manage cards submenu
const [showManageCardsSubMenu,setShowManageCardsSubMenu] = useState(false);
const [userManageCardsSubMenuanchorEl, setuserManageCardsSubMenuAnchorEl] = React.useState<HTMLButtonElement | null>(null);
const userManageCardsSubMenuOpen = Boolean(userManageCardsSubMenuanchorEl);
const userManageCardsSubMenuId = userManageCardsSubMenuOpen ? 'simple-popover' : undefined;





  const [hasLoginErrorMessage,setHasLoginErrorMessage] = useState(false);
  const [invalidLoginMessage,setInvalidLoginMessage] = useState("");
  const [loginInfo,setLoginInfo] = useState({
    name:'test32',
    password:'123'
  })
  const [type, setType] = useState('password');
      const [icon, setIcon] = useState(eyeOff);
   
   
  // handle manage Cards subMenu
  const handleDisplayManageCardsSubMenu = () => {
    setuserManageCardsSubMenuAnchorEl(event?.currentTarget)
    setShowManageCardsSubMenu(true);
  }
  const handleCloseManageCardSubMenu = () => {
    setuserManageCardsSubMenuAnchorEl(null);
  };

  // handle AddCards Sub Sub Menu



  // userCards Main Menu
  const handleCloseUserCardMainMenu = () => {
    setuserCardMainMenuAnchorEl(null);
  };

const handleCardMenuPopup = () => {
  setuserCardMainMenuAnchorEl(event.currentTarget);
 setShowUserCardMainMenu(true);
}

const handlePasswordToggle = () => {
   if (type==='password'){
      setIcon(eye);
      setType('text')
   } else {
      setIcon(eyeOff)
      setType('password')
   }
}

async function handleLogout(event){
  await api.post("/auth/logout",loginToken)
    .catch((error) =>{
      // console.log(error.status)
      
    return error ;
  }) 
    .then((response) => {
      try{
        setShowLoginUserMenu(false);

      }catch(err){

      }
      
      })
}

  async function handleSubmit(event){
    // event.preventDefault()
    const serverConnection = {
      name :event.get("name"),
      password: event.get("password")
    }
    await api.post("/auth/login",serverConnection)
    .catch((error) =>{
      // console.log(error.status)
      if(error.status ===400 || error.status ===401) {
        setHasLoginErrorMessage(true);
        setInvalidLoginMessage("Invalid Credentials")
      } 
    return error ;
  }) 
    .then((response) => {
      try{
        setUserInfo(response.data.user);
        setLoginToken(response.data.token)
        setShowLoginUserMenu(true);
      }catch(err){

      }
      
      })

    
    // console.log(`${name} ${password}`)
    
    // postLogin(loginInfo)
  }
  // ^ Turn off login error message after 4 seconds
  useEffect(() => {
    setTimeout(() => {
    setHasLoginErrorMessage(false);
  }, 5000);
  },[hasLoginErrorMessage])
  const handleInput = (event) => {
    const value = event.target.value;
    setLoginInfo({
      ...loginInfo,
      [event.target.name]:value})


  }
  
  return (
<div>

{showLoginUserMenu ? (
  <div>
  <h1>Hey {userInfo.name}</h1>  
  <Button variant="outlined" onClick={handleCardMenuPopup}>View Cards</Button>
  <Button variant="outlined" onClick={handleLogout}>Logout</Button>
  </div>
) : (

<form action={handleSubmit}>
  <label>Username</label>
  <input type="text" name="name" value={loginInfo.name} onChange={handleInput}/>
  <label>Password</label>
  <input type={type} name="password" value={loginInfo.password} placeholder='Password' onChange={handleInput} autoComplete='current-password'/>
      <button type="submit">Login</button>

</form>
)
}

{/* handle  userSubMenu menu*/}
{showManageCardsSubMenu && (
  <Popover
  id={userManageCardsSubMenuId}
  open={userManageCardsSubMenuOpen}
  anchorEl={userManageCardsSubMenuanchorEl}
  onClose={handleCloseManageCardSubMenu}
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'left',
  }}
  >
    {/* <Button variant="contained" */}
  <Typography sx={{ p: 2 }}>Manage Cards Menu</Typography>
  {/* <TextField id="outlined-basic" label="Outlined" variant="outlined" /> */}
    <SearchBox/>
    <Button variant="outlined" onClick={handleDisplayManageCardsSubMenu}>Manage Cards</Button>
  </Popover>
)}
{/* // handle popover menu  */}
{showUserCardMainMenu && (
  <div>
  {/* <h1>dfsfsd</h1> */}
  <Popover
  id={userMainMenuId}
  open={userMainMenuOpen}
  anchorEl={userCardMainMenuanchorEl}
  onClose={handleCloseUserCardMainMenu}
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'left',
  }}
  >
    {/* <Button variant="contained" */}
  <Typography sx={{ p: 2 }}>User Card Menu</Typography>
    <Button variant="contained" onClick={handleDisplayManageCardsSubMenu}>Manage Cards</Button>
    {/* <Button variant="contained">Add Cards</Button> */}
  </Popover>
  </div>
)}
  

{hasLoginErrorMessage && 
  <h1>{invalidLoginMessage}</h1>
}
</div>
  )
}
