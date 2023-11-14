import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Column, Id } from '@/types';

interface Props {
  column:Column;
  deleteCols:(id:Id)=>void
}

const options = [{
    id:1,
    name:'Rename'
},
{
    id:2,
    name:'Clear'
},
{
    id:3,
    name:'Delete'
},
];

export default function OptionsMenu({column,deleteCols,setEditTaskMode}:Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreHorizIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: '12ch',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.id} onClick={()=>{handleClose()
          console.log(option.id);
          if(option.id===1){
            // alert (`about to rename ${column.name}`)
            setEditTaskMode(true)
            console.log(alert)
          }
          if(option.id===2){
            alert("about to clear")
          }
          if(option.id===3){
            deleteCols(column.id)
          }
         
           } }>
            {option.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}