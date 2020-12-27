import { configureStore } from '@reduxjs/toolkit';
import boardsReducer from './slice/boardsSlice';

export default configureStore({
    reducer: {
        boards: boardsReducer,
    }
})
