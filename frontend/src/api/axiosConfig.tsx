import axios from "axios";
import { usePokemonCardStore } from "../store/pokemonCardsStore";
import type{ PokemonCard } from "../types/PokemonCard";
import type { User } from "../types/User";

export function getPokemonCardsBackend(){
    // return new Promise(res => {
    //     res(["dfsdfsdfs"])
    // })
    return axios
    .get<PokemonCard[]>("http://localhost:5050/record", {params: {_sort:"localId"}} )
    .then(res => res.data)
    
}

export async function postLogin(data:User) { await axios.post('http://localhost:5050/auth/login', {
    name: data.name,
    password: data.password,
  }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
})
}


export default axios.create({
    baseURL: 'http://localhost:5050',
    headers: {'ngrok-skip-browser-warning': "true"}
});
