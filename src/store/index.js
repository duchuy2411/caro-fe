import { configureStore } from '@reduxjs/toolkit';
import boardsReducer from './slice/boardsSlice';
import userInfoDialogReducer from './slice/userInfoDialogSlice';
import onlineUsersReducer from './slice/onlineUsersSlice';

export default configureStore({
    reducer: {
        boards: boardsReducer,
        userInfoDialog: userInfoDialogReducer,
        onlineUsers: onlineUsersReducer
    }
})
