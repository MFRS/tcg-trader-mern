import React,  { type ChangeEvent, useState } from 'react'
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import { useSearchFunction } from '../../utils/Utilfunctions';
import { usePokemonCardStore } from '../../store/pokemonCardsStore';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {type SelectChangeEvent } from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
export const SearchBox = () => {
    const pokeCardStore = usePokemonCardStore();
    const [currentSetDropdown,setCurrentSetDropdown] = useState('0');
    const [currentExpansionDropdown,setCurrentExpansionDropdown] = useState('0');

const handleSetDropdownChange = (event: SelectChangeEvent) => {
    setCurrentSetDropdown(event.target.value as string);
  };
const handleExpansionDropdownChange = (event: SelectChangeEvent) => {
    setCurrentExpansionDropdown(event.target.value as string);
  };


function handleChangeSearchBar(event:ChangeEvent<HTMLInputElement>){
// alert("t")
// let filteredListQuery1:string[] = [];
// for(let i=0;i<pokeCardStore.length;i++){
//     let currentPokemonCard = pokeCardStore[i];
//     let currentPokemonCardName:string = currentPokemonCard.newDisplayName;
//     // console.log(currentPokemonCardName?.toString().substring(0,1))
//     if(currentPokemonCardName?.toString().substring(0,1) === event.target.value.toString()){
//         console.log("found")
//         filteredListQuery1.push(currentPokemonCardName)
//     }
// }
// console.log(filteredListQuery1)

//  return query1;
console.log(useSearchFunction(event.target.value,pokeCardStore.pokemonCards))
}

    





  const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));
  
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));
    
  return (

<div>
 <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Search Card Name</TableCell>
            <TableCell align="center">Rarity</TableCell>
            <TableCell align="center">Expansion</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>


          <TableCell align="center"><Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              onChange={handleChangeSearchBar}
            />
          </Search></TableCell>
          <TableCell>

<FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Rarity</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={currentSetDropdown}
    label="currentSet"
    onChange={handleSetDropdownChange}
    
   

    >
    {pokeCardStore.rarities.map((currentRarity,id) => (
      
      <MenuItem value={id}>{currentRarity}</MenuItem>
    )
  )
}
  </Select>
</FormControl>

          </TableCell>
          <TableCell>

<FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Expansion</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={currentExpansionDropdown}
    label="currentExpansion"
    onChange={handleExpansionDropdownChange}
   

    >
    {pokeCardStore.expansions.map((currentRarity,id) => (
      
      <MenuItem value={id}>{currentRarity}</MenuItem>
    )
  )
}
  </Select>
</FormControl>

          </TableCell>


          

          </TableRow>

        </TableBody>
      </Table>
    </TableContainer>
    
</div>

  )
}
