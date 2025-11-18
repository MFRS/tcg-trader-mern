import { useState, useEffect } from "react";
import api from "./api/axiosConfig.tsx";
import PokeCard from "./components/PokeCard.tsx";
interface PokemonCard {
  localId: string;
  newDisplayName: string;
  image: string;
}

function App() {
  const [pokemonCards, setPokemonCards] = useState<PokemonCard[]>([]);

  const getPokemonCards = async () => {
    try {
      const response = await api.get("/record");
      // console.log(response.data);
      setPokemonCards(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  

  useEffect(() => {
    getPokemonCards();
    
  }, []);

useEffect(() => {
  if (pokemonCards.length > 0) {
    console.log(pokemonCards[0].localId);
  }
}, [pokemonCards]);

    return (
      <div>
        {pokemonCards.length > 0 && (
        <PokeCard key ={pokemonCards[0].localId} card={pokemonCards[0]}/>
        /* {pokemonCards.map((pokemonCard) => (
          <PokeCard key ={pokemonCard.localId} card={pokemonCard}/>
        ))} */
        )}

      </div>
      );
    

}

export default App;
