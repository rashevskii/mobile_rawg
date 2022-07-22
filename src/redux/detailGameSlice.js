import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = '93e37be760e94efa8d21ef300511279c';
const API_URL = 'https://api.rawg.io/api';

const initialState = {
  details: null,
  statusDetails: 'idle',
  statusScreenshots: 'idle',
  errorDetails: null,
  errorScreenshots: null,
  screenshots: [],
};

export const fetchDetailsGame = createAsyncThunk(
  'details/fetchDetailsGame',
  async id => {
    try {
      const response = await axios.get(`${API_URL}/games/${id}?key=${API_KEY}`);
      return response.data;
    } catch (e) {
      console.error(e);
    }
  },
);

export const fetchScreenshots = createAsyncThunk(
  'details/fetchScreenshots',
  async id => {
    try {
      const response = await axios.get(
        `${API_URL}/games/${id}/screenshots?key=${API_KEY}`,
      );
      return response.data.results;
    } catch (e) {
      console.error(e);
    }
  },
);

const detailGameSlice = createSlice({
  name: 'details',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchDetailsGame.pending, (state, action) => {
        state.statusDetails = 'loading';
      })
      .addCase(fetchDetailsGame.fulfilled, (state, action) => {
        state.statusDetails = 'succeeded';
        state.details = action.payload;
      })
      .addCase(fetchDetailsGame.rejected, (state, action) => {
        state.statusDetails = 'failed';
        state.errorDetails = action.error.message;
      })
      .addCase(fetchScreenshots.pending, (state, action) => {
        state.statusScreenshots = 'loading';
      })
      .addCase(fetchScreenshots.fulfilled, (state, action) => {
        state.statusScreenshots = 'succeeded';
        state.screenshots = action.payload;
      })
      .addCase(fetchScreenshots.rejected, (state, action) => {
        state.statusScreenshots = 'failed';
        state.errorScreenshots = action.error.message;
      });
  },
});

export const {} = detailGameSlice.actions;

export default detailGameSlice.reducer;
