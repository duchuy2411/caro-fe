import {
    createSlice,
    createAsyncThunk,
    createSelector,
    createEntityAdapter,
} from '@reduxjs/toolkit';

const initialState = [false, null, null];

const playingUserSlice = createSlice({
    name: 'playingUsers',
    initialState,
    reducers: {
        addHost(state, action) {
            state[1] = action.payload.hostUser;
            state[0] = !state[0];
        },
        addGuest(state, action) {
            state[2] = action.payload.guestUser;
            state[0] = !state[0];
        },
        addHostAndGuest(state, action) {
            state[1] = action.payload.hostUser;
            state[2] = action.payload.guestUser;
            state[0] = !state[0];
        },
        delGuest(state) {
            state[2] = null;
            state[0] = !state[0];
        }
    }
    
});

export const { addHost, addGuest, delGuest, addHostAndGuest } = playingUserSlice.actions
export default playingUserSlice.reducer;

export const selectPlayingUser = (state) =>  state.playingUsers.slice(1);
export const selectRerender = (state) => state.playingUsers[0];