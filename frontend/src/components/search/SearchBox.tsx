import React,  { type ChangeEvent, useState, useRef, useEffect } from 'react'
import type { PokemonCard } from '../../types/PokemonCard';
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
import Typography from '@mui/material/Typography';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { List,type RowComponentProps } from 'react-window';
import { Button } from '@mui/material';




export const SearchBox = () => {
    const pokeCardStore = usePokemonCardStore();
    const [currentRarityDropdown,setCurrentRarityDropdown] = useState('0');
    const [currentExpansionDropdown,setCurrentExpansionDropdown] = useState('0');

    // handle search Query
    const [searchInputValue,setSearchInputValue] = useState<string>("")
  const [showSearchQueryResultsTable,setShowSearchQueryResultsTable] = useState(false);
  const searchQueryListRef = useRef(null);

  // handle card selected display 
  const [showCardSelected,setShowCardSelected] = useState(false);
  const [cardSelectedFromSearchQuery,setCardSelectedFromSearchQuery] = useState<PokemonCard>();

const handleSetDropdownChange = (event: SelectChangeEvent) => {

  // setting dropdown value before zustando doesnt recognize current value set
  setCurrentRarityDropdown(event.target.value as string);
};
const handleExpansionDropdownChange = (event: SelectChangeEvent) => {
  setCurrentExpansionDropdown(event.target.value as string);
};

// sets searchQuery AFTER rarity option has been set
useEffect(()=> {
  pokeCardStore.setPokemonCardsSearchQuery(useSearchFunction(searchInputValue,pokeCardStore,currentRarityDropdown,currentExpansionDropdown))
  setShowSearchQueryResultsTable(true);
  
},[currentRarityDropdown])

// sets searchQuery AFTER expansion option has been set
useEffect(()=>{
  pokeCardStore.setPokemonCardsSearchQuery(useSearchFunction(searchInputValue,pokeCardStore,currentRarityDropdown,currentExpansionDropdown))
  setShowSearchQueryResultsTable(true);
  
},[currentExpansionDropdown])

function handleChangeSearchBar(event:ChangeEvent<HTMLInputElement>){
  
  // set currentSearchValue
  // setCurrentSearchQueryInput(event.target.value as string)
  
  // goal:
  // when I type a letter
  // list is displayed (needs conditional rendering )
  // need to set something that makes list appear
  // map list to show result of useSearchFunction
  
  // what I've tried 
  /*
  
  Test 1 -
  when setting value to a useState, the input box loses focus, and doesn't regain
  focus even with useRef in input box and calling focus through this function
  AND through a useEffect
  
  Test 2 -
  setting value to use Ref. I was able to get first value of result, but when using map, syntax 
  works very odd, and I couldn't get it to show anything else.
  I can't put the values inside {} as they are normally in when using useState
  
  Test 3 - set value to zustand, and call through there. Same result as test 1


  */






 
 setSearchInputValue(event.target.value as string);
  setShowSearchQueryResultsTable(true);
  pokeCardStore.setPokemonCardsSearchQuery(useSearchFunction(event.target.value,pokeCardStore,currentRarityDropdown,currentExpansionDropdown))
  // console.log(searchQueryListRef)
  // key={};
  
}
// hide table if no input is there
// useEffect(() => {
// setShowSearchQueryResultsTable(false);
// },[searchInputValue===""])


    
function handleSearchQueryItemClick(e) {
  setShowSearchQueryResultsTable(false);
  setShowCardSelected(true);
  console.log(e.target.index)
  // setCardSelectedFromSearchQuery(pokeCardStore.searchQuery[e.target.index])


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
              value={searchInputValue}
              ref={searchQueryListRef}
              
              inputProps={{ 'aria-label': 'search' }}
              onChange={handleChangeSearchBar}
              autoFocus
            />
          </Search></TableCell>
          <TableCell>

<FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Rarity</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={currentRarityDropdown}
    label="currentRarity"
    onChange={handleSetDropdownChange}
    
   

    >
    {pokeCardStore.rarities.map((currentRarity,idx) => (
      
      <MenuItem value={idx}>{currentRarity}</MenuItem>
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

    {/* manage cards search display list */}
    {/* it only displays if the searchQuery is smaller than the full list of pokemon cards */}
{showSearchQueryResultsTable && pokeCardStore.searchQuery.length !=pokeCardStore.pokemonCards.length && (
    <div>

  {pokeCardStore.searchQuery.map((currentPokemonCard)=>(
    // <Button>

      <Typography >{currentPokemonCard.name}</Typography>
    // </Button>

  ))}

  </div>
)
}
{/* show Card selected */}
{showCardSelected && (
  <div>

    <Typography>{cardSelectedFromSearchQuery.name}</Typography>
    
    </div>
)}
</div>
  )
}
  

