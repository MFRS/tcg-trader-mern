import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import type { User } from '../../types/User';
import { use } from 'react';
import { useEffect } from 'react';
import { Button } from '@mui/material';
import { usePokemonCardStore } from '../../store/pokemonCardsStore';




export default function CardOwnersList({cardId,playersWhoWantsThisCardToTrade,numberCardsPerPlayer} : {cardId:string,playersWhoWantsThisCardToTrade:User[],numberCardsPerPlayer:number[]}) {
  // userid , number of cards
  const usePokeStore = usePokemonCardStore();
// 

  // console.log(`${playersWhoWantsThisCardToTrade}`)


  function copyToClipboard(value:string){
    navigator.clipboard.writeText(value)
    .then(() => {
      console.log("copied",value);
    })
    .catch((err) =>{
      console.error("f");
    })

    
  }



  function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
  ) {
    return { name, calories, fat, carbs, protein };
  }
  
  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">TCGP Username</TableCell>
            <TableCell align="right">TCGP ID (Click on ID to copy)</TableCell>
            <TableCell align="right">Number of Cards</TableCell>
            <TableCell align="right">Last Logged In</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {playersWhoWantsThisCardToTrade.map((row,index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.tcgIdName}
              </TableCell>
              <TableCell align="right">
                <Button onClick={() =>copyToClipboard(row.tcgIdNo)}>
                  {row.tcgIdNo}
                </Button>
                </TableCell>
              <TableCell align="right">{numberCardsPerPlayer[index]}</TableCell>
              <TableCell align="right">{row.lastLogin}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
