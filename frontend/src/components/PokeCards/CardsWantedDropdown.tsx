import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material';
import type { User } from '../../types/User';
import CardOwnersList from './CardOwnersList';
import { useEffect,useState } from 'react';


export default function CardsWantedDropDown({cardsWantedIds,playerTradeInfo}: {cardsWantedIds:String[],playerTradeInfo:User[]}) {
  const [currentCardId, setCurrentCardId] = React.useState('');
  const [playersWhoWantsThisCardToTrade,setPlayersWhoWantsThisCardToTrade]=useState<User[]>([]);
  const [numberofCardsEachPlayerHas,setNumberofCardsEachPlayerHas]=useState<number[]>([]);
  const handleChange = (event: SelectChangeEvent) => {
    // need to keep value as 
    setCurrentCardId(event.target.value as string);
    // ! fetch the players info that have these cards
    // console.log(playerTradeInfo)
  // return array with players who have card selected
  // using cardId, I can find out the name of the player who has it, and its quantity
  
  
  
};
// console.log(cardsWantedIds)

useEffect(()=>{
  // Gets Players who wants this card, and orders them by time of log in
  const players = playerTradeInfo.filter(currentPlayer => currentPlayer.cardsWanted?.filter(currentCard => currentCard.id === currentCardId).length>0).sort((a,b) =>new Date(b.lastLogIn).getTime() -new Date(a.lastLogIn).getTime());
    setPlayersWhoWantsThisCardToTrade(players);
    // looks through the quantity of each card the player has and maps it to the same index as the one in playersWhoWantsThisCardToTrade
    const cardNumbers = players.map(currentPlayer => currentPlayer.cardsWanted?.filter(currentCard => currentCard.id === currentCardId).reduce((acc,currVal)=> acc + currVal.quantity,0))
    setNumberofCardsEachPlayerHas(cardNumbers)

  },[currentCardId])

useEffect(()=>{
  // console.log(playersWhoWantsThisCardToTrade);
},[playersWhoWantsThisCardToTrade])

  return (
    <div>
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Cards For Trade</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          displayEmpty
          value={currentCardId}
          label="cardsForTrade"
          onChange={handleChange}
        >
            {cardsWantedIds.map((currentId,i) =>
                (
                <MenuItem value={currentId}>{currentId}</MenuItem>
                )
            )
        }

        </Select>
      </FormControl>
    </Box>

        // Show list of players who have that card selected
        {playersWhoWantsThisCardToTrade.length>0 && (
          <CardOwnersList cardId = {currentCardId} playersWhoWantsThisCardToTrade ={playersWhoWantsThisCardToTrade} numberCardsPerPlayer ={numberofCardsEachPlayerHas}/>
        )}
        

</div>
  );
}
