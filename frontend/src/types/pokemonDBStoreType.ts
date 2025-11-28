import type {PokemonCard} from "./PokemonCard.ts"




export type PokemonDBStoreType ={
    pokemonCards: PokemonCard[];
    
    setPokemonCards: (pokemonCards:PokemonCard[]) => void;
}