import React from 'react'
import { Alert, IconButton, Collapse } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'

const ErrorAlert = ({ message, onClose }) => {
  return (
    <Collapse in={!!message}>
      <Alert
        severity="error"
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{ mb: 2 }}
      >
        {message}
      </Alert>
    </Collapse>
  )
}

export default ErrorAlert