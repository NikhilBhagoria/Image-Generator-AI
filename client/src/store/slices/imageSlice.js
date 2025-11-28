import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../api/axiosInstance' 
import { handleApiError } from '../../utils/handleApiError'

// Generate Image Async Thunk
export const generateImageAsync = createAsyncThunk(
  'image/generateImage',
  async (prompt, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/images/generate', { prompt })
      return {
        url: response.data.imageUrl,
        prompt,
        id: Date.now(),
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
)

const imageSlice = createSlice({
  name: 'image',
  initialState: {
    prompt: '',
    generatedImage: null,
    imageHistory: [],
    loading: false,
    error: null
  },
  reducers: {
    setPrompt: (state, action) => {
      state.prompt = action.payload
    },
    clearGeneratedImage: (state) => {
      state.generatedImage = null
    },
    // Optional: clear history or reset state
    resetImageState: (state) => {
      state.prompt = ''
      state.generatedImage = null
      state.imageHistory = []
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateImageAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(generateImageAsync.fulfilled, (state, action) => {
        const newImage = action.payload
        state.loading = false
        state.generatedImage = newImage
        state.imageHistory = [newImage, ...state.imageHistory]
        // Clear prompt after successful generation (optional UX choice)
        // state.prompt = ''
      })
      .addCase(generateImageAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        console.error('Image generation failed:', action.payload)
      })
  }
})

export const { setPrompt, clearGeneratedImage, resetImageState } = imageSlice.actions

export default imageSlice.reducer