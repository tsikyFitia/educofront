// src/components/common/Notification.jsx
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Snackbar, Alert } from '@mui/material'
import { removeNotification } from '../../store/slices/uiSlice'

const Notification = () => {
  const dispatch = useDispatch()
  const { notifications } = useSelector((state) => state.ui)

  const handleClose = (id) => {
    dispatch(removeNotification(id))
  }

  return (
    <>
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={6000}
          onClose={() => handleClose(notification.id)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => handleClose(notification.id)}
            severity={notification.type || 'info'}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  )
}

export default Notification