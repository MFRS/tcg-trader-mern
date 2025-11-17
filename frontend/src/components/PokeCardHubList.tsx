import React, { useState } from 'react'
import api from "./api/axiosConfig.tsx"

const PokeCardHubList = () => {
    const [cards,setCards] = useState([]);


  const refresh = useCallback(async () => {
    try {
      const data = await apiFetch("/record/");
      setCards(data || []);
      console.log(data)
    } catch (err) {
      console.error("Failed to load records:", err);
    }
  }, []);

  return (
    <div>
      
    </div>
  )
}

export default PokeCardHubList
