import type {PokemonCard} from "./PokemonCard.ts"




export type PokemonDBStoreType ={
    pokemonCards: PokemonCard[];
    rarities: string[];
    expansions : string[];
    searchQuery: PokemonCard[];
    splitSearchPokemonNameCharacters: string[];
    
    setPokemonCards: (pokemonCards:PokemonCard[]) => void;
    setPokemonCardsSearchQuery : (searchQuery:PokemonCard[]) => void;
}