import { Button, DialogActions } from '@mui/material';

const CloseButton = ({ 
  onClose, 
  text = "Close", 
  color = "primary",
  variant = "text",
  size = "medium",
  className = "",
  ...props 
}) => {
  return (
    <DialogActions>
      <Button 
        onClick={onClose} 
        color={color}
        variant={variant}
        size={size}
        className={className}
        {...props}
      >
        {text}
      </Button>
    </DialogActions>
  );
};

export default CloseButton;