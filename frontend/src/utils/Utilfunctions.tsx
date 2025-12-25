


export function wait(duration:number){
    return new Promise(resolve=>setTimeout(resolve,duration) )
}

export function useSearchFunction(searchString:string,pokeCardStore){
    // ? search function

// when one letter is written, you search for a word in the pokemon card
// search function will search by words.

// divide query 

// add 

//query 1  return list of cards whose name start with letterr
    const query1 = pokeCardStore.filter((currentPokemonCard,i)=> currentPokemonCard?.newDisplayName?.substring(0,1).toLowerCase() === event.target.value ).map(currentCard => currentCard.newDisplayName)
    // query 2 - 
    
    
    
    
    return query1;
   

}