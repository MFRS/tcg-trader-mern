import type {PokemonCard} from "./PokemonCard.ts"




export type PokemonDBStoreType ={
    pokemonCards: PokemonCard[];
    rarities: string[];
    expansions : string[];
    
    setPokemonCards: (pokemonCards:PokemonCard[]) => void;
}