import { configureStore } from '@reduxjs/toolkit';
import boardsReducer from './slice/boardsSlice';
import userInfoDialogReducer from './slice/userInfoDialogSlice';
import onlineUsersReducer from './slice/onlineUsersSlice';
import matchHistoryItemReducer from './slice/matchHistoryItemSlice';

export default configureStore({
    reducer: {
        boards: boardsReducer,
        userInfoDialog: userInfoDialogReducer,
        onlineUsers: onlineUsersReducer,
        matchHistoryItem: matchHistoryItemReducer
    }
})
