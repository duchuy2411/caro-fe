import {
    createSlice,
    createAsyncThunk,
    createSelector,
    createEntityAdapter,
} from '@reduxjs/toolkit'
import axios from "../../utils/axios";

const boardsAdapter = createEntityAdapter({
    selectId: (board) => board._id
});

const initialState = boardsAdapter.getInitialState({
    status: 'idle',
    error: null,
});

export const fetchBoards = createAsyncThunk('boards/fetchBoards', async () => {
    const response = await axios.get('/boards');
    return response.data.data;
})

const boardSlice = createSlice({
    name: 'boards',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchBoards.fulfilled]: (state, action) => {
            state.status = 'succeeded';
            boardsAdapter.upsertMany(state, action.payload);
        },
        [fetchBoards.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        }
    },
});

export default boardSlice.reducer;

export const {
    selectAll: selectAllBoards,
} = boardsAdapter.getSelectors((state) => state.boards);

