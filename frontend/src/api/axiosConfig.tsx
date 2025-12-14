import axios from "axios";
import { usePokemonCardStore } from "../store/pokemonCardsStore";
import type{ PokemonCard } from "../types/PokemonCard";

export function getPokemonCardsBackend(){
    return new Promise(res => {
        res(["dfsdfsdfs"])
    })
    return axios
    .get<PokemonCard[]>("http://localhost:5050/record", {params: {_sort:"localId"}} )
    .then(res => res.data)
    
}


export default axios.create({
    baseURL: 'http://localhost:5050',
    headers: {'ngrok-skip-browser-warning': "true"}
});
