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

export const addNewBoard = createAsyncThunk('boards/addNewBoard', async (initBoard) => {
    const response = await axios.post('/boards', initBoard);
    return response.data.data;
})

const boardSlice = createSlice({
    name: 'boards',
    initialState,
    reducers: {
        boardUpdated(state, action) {
            const { newBoard } = action.payload;
            const existingBoard = state.entities[newBoard._id];
            if (existingBoard) {
                existingBoard.id_user1 = newBoard.id_user1;
                existingBoard.id_user2 = newBoard.id_user2;
            }
        }
    },
    extraReducers: {
        [fetchBoards.fulfilled]: (state, action) => {
            state.status = 'succeeded';
            boardsAdapter.upsertMany(state, action.payload);
        },
        [fetchBoards.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        [addNewBoard.fulfilled]: boardsAdapter.addOne,
    },
});

export const { boardUpdated } = boardSlice.actions;

export default boardSlice.reducer;

export const {
    selectAll: selectAllBoards,
    selectIds: selectBoardIds,
    selectById: selectBoardById
} = boardsAdapter.getSelectors((state) => {
    return state.boards;
});

export const selectBoardByRoom = createSelector(
    [selectAllBoards, (state, idRoom) => {
        return idRoom}],
    (boards, idRoom) => {
        return boards.filter(board => board.code == idRoom);
    },
)

