import React, {useState} from 'react'
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import type { PokemonCard } from '../../types/PokemonCard';
const CardImagePopover = ({card,parentElement}: {card:PokemonCard,parentElement:HTMLButtonElement | null}) => {
    const [anchorEl,setAnchorEl] =useState<HTMLElement | null>(null);
        const [showImage,setShowImage] = useState(false);
        const open = Boolean(parentElement)
    const id = open ? 'simple-popover' : undefined;
    const [loadedOnce,setLoadedOnce] = useState(false);
    
    const handlePopoverClose = () => {
      console.log("out");
      setShowImage(false);
      setAnchorEl(null);
      
    }
    
    
    
  return (
    <div>
      {/* {loadedOnce && ( */}
              <Popover
              
      id={id}
      open={open}
      anchorEl={parentElement}
      onClose={handlePopoverClose}
      anchorOrigin={{
        vertical:'top',
        horizontal:'left',
      }}
      transformOrigin={{
        vertical:"top",
        horizontal:"left"
      }}
      sx={{pointerEvents:"none"}}
      disableRestoreFocus
      >
      
          <img
          src={`${card.image}/low.png`}
          alt={card.newDisplayName}
          width={200}
          style={{ display: "block", marginTop: "8px",float:"left" }} />
            </Popover> 
        {/* )} */}
    </div>
  )
}

export default CardImagePopover
