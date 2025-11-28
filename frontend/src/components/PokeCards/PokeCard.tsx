// Pokemon Tcg Pocket Trade application development


import { useState,useEffect } from 'react';
import type{ PokemonCard } from '../../types/PokemonCard.ts'
import api from "../../api/axiosConfig.tsx"
import type { User } from '../../types/User.ts';
import CardsWantedDropDown from './CardsWantedDropdown.tsx';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Popper, Tab } from '@mui/material';
import Popover from '@mui/material/Popover';
import { usePokemonCardStore } from '../../store/pokemonCardsStore.tsx';
function PokeCard({card}: {card:PokemonCard}) {
    const [showImage,setShowImage] = useState(false);
    const [loadedOnce,setLoadedOnce] = useState(false);
  // playerTraderPublicInfo
    const [playerTradeInfo,setPlayerTradeInfo] = useState<User[]>([]);
    const [cardsWantedIds,setCardsWantedIds] = useState<string[]>([]);
    const [cardNamesAvailableForTrade,setCardsNamesAvailableForTrade] = useState<string[]>([]);
  const pokeCardStore = usePokemonCardStore();
    // Popover feature
    const [anchorEl,setAnchorEl] =useState<HTMLElement | null>(null);
    
    const handlePopoverClick = (event: React.MouseEvent<HTMLElement>) => {
      setImageToLoadOnce()
      setAnchorEl(event.currentTarget);
    };
    
    const handlePopoverClose = () => {
      console.log("out");
      setShowImage(false);
      setAnchorEl(null);
      
    }
    
    const open = Boolean(anchorEl)
    const id = open ? 'simple-popover' : undefined;

    
    function setImageToLoadOnce(){
        setShowImage(true);
        setLoadedOnce(true);
    }

    // ! playerTradeInfo is an array that fetches a getAccount route for each of the player who has this Card for Trade


    // player clicks dropdown that shows cards wanted to trade for this one
    /*
    fetch playersIDs from tradeUsers list 
    fetch all public info from the ids
    each element in the dropdown
    -can have several people who have the card for trade
    -show card once, and if you click 
    -languages available
    you can choose player for trade




    */
  const allUserIds = Object.keys(card.tradeUsers ?? {});



  /* returns array 
   0 - ids of cards wanted to trade with current card]


  */
  function getListOfSeparateCardsWanted(){
    // final return
    /*
      [cardid1,cardid2]
    */
  //  console.log(playerTradeInfo.
  // create a list to StoreIds
   let cardIds:string[] = [] ;
  //  loop through players
  // I cannot see all players
  for(let i=0;i<playerTradeInfo.length;i++){
    let currentPlayer = playerTradeInfo[i];
    // loop through cardsWanted
    // console.log(Object.keys(currentPlayer))
    // console.log(currentPlayer.cardsWanted)
    if(currentPlayer.cardsWanted){
      for(let r=0;r<currentPlayer.cardsWanted.length;r++){
        let currentCardId = currentPlayer.cardsWanted[r].id;
        // check if current cardId is already in cardIds
        if(!cardIds.includes(currentCardId)){

          cardIds.push(currentCardId);
        }
      }

    }
    
  }
  return [cardIds];
    // 
  
  
  // return
   
  }
// This sets PlayerTradeInfo state by fetching all users inside current card that have this card for Trade
useEffect(() => {
  // If there are no users trading this card, no need to hit the API
  if (allUserIds.length === 0) {
    // console.log(allUserIds)
    setPlayerTradeInfo([]);
    return;
  }

  const getPublicId = async () => {
    try {
      const responses = await Promise.all(
        allUserIds.map((userId) =>
          api.get<User>(`/auth/accounts/${userId}`)
          // If you need auth:
          // api.get<User>(`/auth/accounts/${userId}`, {
          //   headers: { Authorization: `Bearer ${token}` }
          // })

        )
      );

      const users = responses.map((res) => res.data);
      setPlayerTradeInfo(users);
    } catch (err) {
      console.error("Error fetching player trade info:", err);
    }
  };
  

  getPublicId();


  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [card]); // or [JSON.stringify(allUserIds)] if the user list can change
    



  // use for Debug
      useEffect(()=> {
          //  ! set cardsUserIds once
          // console.log(playerTradeInfo)
            setCardsWantedIds(getListOfSeparateCardsWanted()[0])

              //  set names of cards for trade cards list  
        setCardsNamesAvailableForTrade(cardsWantedIds.map(currentId=>pokeCardStore.pokemonCards.find(pokemonCard=>pokemonCard.id === currentId)?.newDisplayName))
          // ! set dropdown
        }
      ,[playerTradeInfo])
    
    
// dropdown is invisible if there are no players trading the card
// if is visible, then you will see a list of cards for trade by their code
// cards are ordered by the players who logged in the closest to the time checked
// visibly display to user
// each item that you hover the card image appears
// when you click on the list item, you see all users who are looking for that card ( ordered by time of logged in)
// when you click on a user, the tcgp Id and username pops up

    
    
return (
   

          <TableRow key={0} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} > 

  <TableCell component="th" scope='row'
        onMouseEnter={handlePopoverClick}
      onMouseLeave={handlePopoverClose}
        >





      
      {card.newDisplayName}
      {/* Only load image when showImage is true */}
      {loadedOnce && (
        <Popover
        
id={id}
open={open}
anchorEl={anchorEl}
onClose={handlePopoverClose}
anchorOrigin={{
  vertical:'center',
  horizontal:'left',
}}
transformOrigin={{
  vertical:"top",
  horizontal:"center"
}}
sx={{pointerEvents:"none"}}
disableRestoreFocus
>

    <img
    src={`${card.image}/low.png`}
    alt={card.newDisplayName}
    width={200}
    style={{ display: "block", marginTop: "8px",float:"left" }} />
      </Popover> 
  )}






    
    </TableCell>
  <TableCell component="th" scope='row'>{card.availableCards}</TableCell>
  {playerTradeInfo.length >0 && (
  <TableCell component="th" scope='row'>      <CardsWantedDropDown cardsWantedIds={cardsWantedIds} playerTradeInfo={playerTradeInfo} cardNamesAvailableForTrade={cardNamesAvailableForTrade}/></TableCell>
  )}

          </TableRow>

)}

export default PokeCard;


