import {create} from 'zustand'
import type { PokemonCard } from '../types/PokemonCard'
import type { PokemonDBStoreType } from '../types/pokemonDBStoreType'




export const usePokemonCardStore = create<PokemonDBStoreType>(
    (set)=> ({
    pokemonCards: [],
    setPokemonCards: (pokemonCards:PokemonCard[]) =>
        set(
            
            () => ({pokemonCards}),
        )
    })
)         
