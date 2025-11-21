import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const fetchChatHistory = createAsyncThunk(
    'user/fetchChatHistory',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/chat/history');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    chatHistory: [],
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchChatHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchChatHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.chatHistory = action.payload;
            })
            .addCase(fetchChatHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});
export default userSlice.reducer;