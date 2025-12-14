import { useState, useEffect } from "react";
import api from "./api/axiosConfig.tsx";
import { getPokemonCardsBackend } from "./api/axiosConfig.tsx";
import PokeCard from "./components/PokeCards/PokeCard.tsx";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Popper } from '@mui/material';
import Popover from '@mui/material/Popover';
import {  usePokemonCardStore } from "./store/pokemonCardsStore.tsx";
import LoginForm from "./components/accounts/LoginForm.tsx";
import Typography from '@mui/material/Typography';
import { wait } from "./utils/Utilfunctions.tsx";
import { useMutation,useQuery,useQueryClient } from "@tanstack/react-query";
interface PokemonCard {
  localId: string;
  newDisplayName: string;
  image: string;
}

function App() {


  const pokeCardStore = usePokemonCardStore();
  
  const [pokemonCards, setPokemonCards] = useState<PokemonCard[]>([]);

  // login popup state
  const [showLoginForm,setShowLoginForm] = useState(false);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  
  const handleLoginBtnClose = () => {
    setAnchorEl(null);
  };

  const openLoginBtn = Boolean(anchorEl);
  const idLoginBtn = openLoginBtn ? 'simple-popover' : undefined;

  // const newPostMutation = useMutation({
  //   mutationFn: title => {
  //     return wait(1000).then(()=>
  //       POSTS.push({id:crypto.randomUUID(),title})
  //     )
  //   }
  // })


  const getPokemonCards = async () => {
    try {
      const response = await api.get("/record");
      // console.log(response.data);
      setPokemonCards(response.data);
      // setting pokecardstore for using with other components
      pokeCardStore.setPokemonCards(response.data)
      return response;
    } catch (err) {
      console.log(err);
    }
  };

    // pop sign in when clicked
    function handleLoginPopScreen(event: React.MouseEvent<HTMLButtonElement>){
      setAnchorEl(event.currentTarget);
      setShowLoginForm(true);
    }
  

  useEffect(() => {
    getPokemonCards();
    
  }, []);



useEffect(() => {
  if (pokemonCards.length > 0) {
    // console.log(pokeCardStore.pokemonCards)
    // console.log(pokemonCards[0].localId);
  }
}, [pokemonCards]);

    return (
      <div>
        <text></text>
      <LoginForm/>
        {pokemonCards.length > 0 && (
          
        // <PokeCard key ={pokemonCards[0].localId} card={pokemonCards[0]}/>

        
        //  
        <TableContainer>
      <Table sx={{minWidth:650}} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Card Name (Hover For Image)</TableCell>
            <TableCell align="left">No. of Available Cards</TableCell>
            <TableCell align="left">Cards Required For Trade</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        
          <PokeCard key ={pokemonCards[0].localId} card={pokemonCards[0]}/>
     
        {/* {pokemonCards.map((pokemonCard) => (
          <PokeCard key ={pokemonCard.localId} card={pokemonCard}/>
        ))} */}
                  </TableBody>
      </Table>
      </TableContainer>

        )}

      </div>
      );
    

}

export default App;
