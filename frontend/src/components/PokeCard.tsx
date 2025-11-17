import { useState } from 'react';
import type{ PokemonCard } from '../types/PokemonCard'

function PokeCard({card}: {card:PokemonCard}) {
    const [showImage,setShowImage] = useState(false);
    const [loadedOnce,setLoadedOnce] = useState(false);

    function setImageToLoadOnce(){
        setShowImage(true);
        setLoadedOnce(true);
    }
    
    
return (
    <div
      onMouseEnter={() => setImageToLoadOnce()}
      onMouseLeave={() => setShowImage(false)}
      style={{ padding: "10px" }}
    >
      <p>{card.newDisplayName}</p>

      {/* Only load image when showImage is true */}
      {loadedOnce && showImage ? (
        <img
          src={`${card.image}/low.png`}
          alt={card.newDisplayName}
          width={200}
          style={{ display: "block", marginTop: "8px" }} />
      ): (
        <span style={{ fontSize:"12px",opacity:0.6}}>
        Hover To load preview...
        </span>
      )}
      </div>
)}

export default PokeCard;
