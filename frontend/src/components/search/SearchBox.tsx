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
import { Button } from '@mui/material';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemIcon from '@mui/material/ListItemIcon';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import CardImagePopover from '../PokeCards/CardImagePopover';






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

  // handle search query results list 
  const [openSearchQueryResultList, setOpenSearchQueryResultList] = React.useState(true);
  const [currentSearchQueryResultsListHovered,setCurrentSearchQueryResultsListHovered] = useState<HTMLButtonElement | null>(null);
  const handleSearchQueryResultListClick = () => {
    setOpenSearchQueryResultList(!openSearchQueryResultList);
  };
  
  
  const handleSetDropdownChange = (event: SelectChangeEvent) => {
    setOpenSearchQueryResultList(true);
    // setting dropdown value before zustando doesnt recognize current value set
    setCurrentRarityDropdown(event.target.value as string);
  };
  const handleExpansionDropdownChange = (event: SelectChangeEvent) => {
    setOpenSearchQueryResultList(true);
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


// search query component
const SearchQueryListComponent = () => {

  
  
  return (
    <div>
      {/* {showCardSelected && (
        <CardImagePopover card={cardSelectedFromSearchQuery || null} parentElement={currentSearchQueryResultsListHovered}/> 
    
      )} */}
    <List
      sx={{ width: '100%', maxWidth: 760, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      
      <ListItemButton onClick={handleSearchQueryResultListClick}>
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary={`Card Selected : ${cardSelectedFromSearchQuery?.name || "None"}  `} />
        {openSearchQueryResultList ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openSearchQueryResultList} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>


          {/* Map Begins */}
            {pokeCardStore.searchQuery.map((currentPokemonCard,idx) => (
          <ListItemButton sx={{ pl: 4 }} 
          key={idx}
          onClick={()=> {
            setCardSelectedFromSearchQuery(currentPokemonCard)
            handleSearchQueryResultListClick()
          }
        }
          // onMouseEnter={()=> {
          //   // console.log("hover")
          //   setShowCardSelected(true);
          //   setCardSelectedFromSearchQuery(currentPokemonCard)
          //   setCurrentSearchQueryResultsListHovered(event?.currentTarget)
            
          // }
          // }
          
            >


              
            {/* <ListItemIcon>
              <StarBorder />
            </ListItemIcon> */}
              <ListItemText primary={currentPokemonCard.name} />
               <img
          src={`${currentPokemonCard.image}/low.png`}
          alt={currentPokemonCard.newDisplayName}
          width={100}
          style={{ display: "block", marginTop: "8px",float:"left" }} />
          </ListItemButton>
            ))}
        </List>
      </Collapse>
    </List>
  
  </div>
  );
}



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
 setOpenSearchQueryResultList(true);
  setShowSearchQueryResultsTable(true);
  pokeCardStore.setPokemonCardsSearchQuery(useSearchFunction(event.target.value,pokeCardStore,currentRarityDropdown,currentExpansionDropdown))
  // console.log(searchQueryListRef)
  // key={};
  
}
// hide table if no input is there
// useEffect(() => {
// setShowSearchQueryResultsTable(false);
// },[searchInputValue===""])

useEffect(()=> {
console.log(currentSearchQueryResultsListHovered)
},[currentSearchQueryResultsListHovered])
    


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

  <SearchQueryListComponent></SearchQueryListComponent>

  </div>
)
}
{/* show Card selected */}
{showCardSelected && (
  <div>

    
    </div>
)}
</div>
  )
}
  

