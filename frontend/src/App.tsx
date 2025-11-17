import { useState, useEffect } from "react";
import api from "./api/axiosConfig.tsx";

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
      console.log(response.data);
      setPokemonCards(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPokemonCards();
  }, []);

  function returnPokemonCardList() {
    return pokemonCards.map((pokemonCard) => (
      <div key={pokemonCard.localId}>
        <h3>{pokemonCard.newDisplayName}</h3>
        <img src={pokemonCard.image} alt={pokemonCard.newDisplayName} width="120" />
      </div>
    ));
  }

  return <div>{returnPokemonCardList()}</div>;
}

export default App;
