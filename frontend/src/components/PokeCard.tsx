import { useState,useEffect } from 'react';
import type{ PokemonCard } from '../types/PokemonCard'
import api from "../api/axiosConfig.tsx"
import type { User } from '../types/User.ts';
function PokeCard({card}: {card:PokemonCard}) {
    const [showImage,setShowImage] = useState(false);
    const [loadedOnce,setLoadedOnce] = useState(false);
  // playerTraderPublicInfo
    const [playerTradeInfo,setPlayerTradeInfo] = useState<User[]>([]);


    function setImageToLoadOnce(){
        setShowImage(true);
        setLoadedOnce(true);
    }

    // player clicks dropdown that shows cards wanted to trade for this one
    /*
    fetch playersIDs from tradeUsers list 
    fetch all public info from the ids





    */
  const allUserIds = Object.keys(card.tradeUsers ?? {});


useEffect(() => {
  // If there are no users trading this card, no need to hit the API
  if (allUserIds.length === 0) {
    setPlayerTradeInfo([]);
    return;
  }

  const getPublicId = async () => {
    try {
      const responses = await Promise.all(
        allUserIds.map((userId) =>
          api.get<User>(`/auth/accounts/${userId}`)
          // If you need auth:
          // api.get<User>(`/auth/accounts/${userId}`, {
          //   headers: { Authorization: `Bearer ${token}` }
          // })
        )
      );

      const users = responses.map((res) => res.data);
      setPlayerTradeInfo(users);
    } catch (err) {
      console.error("Error fetching player trade info:", err);
    }
  };

  getPublicId();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [card.id]); // or [JSON.stringify(allUserIds)] if the user list can change
    
      useEffect(()=> {
        if (playerTradeInfo.length >0){
          console.log(playerTradeInfo)
        }
      })
    
    
// dropdown is invisible if there are no players trading the card
// if is visible, then you will see a list of cards for trade by their code
// cards are ordered by the players who logged in the closest to the time checked
// visibly display to user
// each item that you hover the card image appears
// when you click on the list item, you see all users who are looking for that card ( ordered by time of logged in)
// when you click on a user, the tcgp Id and username pops up

    
    
return (
    <div
      onMouseEnter={() => setImageToLoadOnce()}
      onMouseLeave={() => setShowImage(false)}
      style={{ padding: "10px" }}
    >
      <p>{card.newDisplayName}</p>
      <p>Available Cards: {card.availableCards}</p>
      <p>Trade Users: {card.availableCards}</p>

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


