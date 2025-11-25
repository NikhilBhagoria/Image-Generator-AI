import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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

export const sendMessage = createAsyncThunk(
    'user/sendMessage',
    async ({ message, conversationHistory }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/chat/send', { message,conversationHistory });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const analyzeDocument = createAsyncThunk(
    'user/analyzeDocument',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/documents/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
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
    reducers: {
        // Optional: add message locally (e.g., optimistic update)
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        // Clear error
        clearError: (state) => {
            state.error = null;
        },
    },
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
export const { addMessage, clearError } = userSlice.actions;
export default userSlice.reducer;