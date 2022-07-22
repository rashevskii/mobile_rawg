import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = '93e37be760e94efa8d21ef300511279c';
const API_URL = 'https://api.rawg.io/api';
const COUNT = 10;
const API = `${API_URL}/games?key=${API_KEY}&page_size=${COUNT}`;

const getOrdering = target => {
  let order;
  switch (target) {
    case 0:
      order = 'rating';
      break;
    case 1:
      order = '-rating';
      break;
    case 2:
      order = 'released';
      break;
    case 3:
      order = '-released';
      break;
    default:
      order = '';
  }
  return order;
};

const getApiGamesMore = (order, filter, ordering, searched, text, page) => {
  const search = searched ? text : '';
  if (order !== '' && filter !== '') {
    return `${API}&page=${page}&ordering=${ordering}&platforms=${filter}&search=${search}`;
  } else if (order !== '' && filter === '') {
    return `${API}&page=${page}&ordering=${ordering}&search=${search}`;
  } else if (order === '' && filter !== '') {
    return `${API}&page=${page}&platforms=${filter}&search=${search}`;
  } else {
    return `${API}&page=${page}&search=${search}`;
  }
};

const getApiSortedGames = (order, index, filter, text, searched) => {
  let ordering;
  if (order !== undefined) {
    ordering = getOrdering(order);
  } else {
    ordering = getOrdering(index);
  }
  const search = searched ? text : '';
  return filter === undefined
    ? `${API}&ordering=${ordering}&search=${search}`
    : `${API}&ordering=${ordering}&platforms=${filter}&search=${search}`;
};

const getApiFilteredGames = (filter, id, order, text, searched) => {
  let ordering;
  if (order !== '') {
    ordering = getOrdering(order);
  }
  const search = searched ? text : '';
  return order === ''
    ? `${API}&platforms=${filter ? filter : id}&search=${search}`
    : `${API}&platforms=${
        filter ? filter : id
      }&ordering=${ordering}&search=${search}`;
};

const getApiSearchGame = (text, debouncedSearchTerm, order, filter) => {
  let ordering;
  if (order !== '') {
    ordering = getOrdering(order);
  } else {
    ordering = '';
  }
  const searchText = text ? text : debouncedSearchTerm;
  if (order !== '' && filter !== '') {
    return `${API}&ordering=${ordering}&platforms=${filter}&search=${searchText}`;
  } else if (order !== '' && filter === '') {
    return `${API}&ordering=${ordering}&search=${searchText}`;
  } else if (order === '' && filter !== '') {
    return `${API}&platforms=${filter}&search=${searchText}`;
  } else {
    return `${API}&search=${searchText}`;
  }
};

const initialState = {
  games: [],
  status: 'idle',
  error: null,
  moreLoading: 'idle',
  platforms: [],
  statusPlatforms: 'idle',
  sortedGames: [],
};

export const fetchGamesPerPage = createAsyncThunk(
  'games/fetchGamesPerPage',
  async () => {
    try {
      const response = await axios.get(API);
      return response.data.results;
    } catch (e) {
      console.error(e);
    }
  },
);

export const fetchGamesMore = createAsyncThunk(
  'games/fetchGamesMore',
  async ({page, order, filter, text, searched = false}) => {
    const ordering = getOrdering(order);
    const api = getApiGamesMore(order, filter, ordering, searched, text, page);
    try {
      const response = await axios.get(api);
      return response.data.results;
    } catch (e) {
      console.error(e);
    }
  },
);

export const fetchPlatforms = createAsyncThunk(
  'games/fetchPlatforms',
  async () => {
    const api = `${API_URL}/platforms?key=${API_KEY}`;
    try {
      const response = await axios.get(api);
      return response.data.results.map(item => ({
        name: item.name,
        id: item.id,
      }));
    } catch (e) {
      console.error(e);
    }
  },
);

export const fetchSortedGames = createAsyncThunk(
  'games/fetchSortedGames',
  async ({order, index, filter, text, searched}) => {
    const api = getApiSortedGames(order, index, filter, text, searched);
    try {
      const response = await axios.get(api);
      return response.data.results;
    } catch (e) {
      console.error(e);
    }
  },
);

export const fetchFilteredGames = createAsyncThunk(
  'games/fetchFilteredGames',
  async ({filter, id, order, text, searched}) => {
    const api = getApiFilteredGames(filter, id, order, text, searched);
    try {
      const response = await axios.get(api);
      return response.data.results;
    } catch (e) {
      console.error(e);
    }
  },
);

export const fetchSearchGame = createAsyncThunk(
  'games/fetchSearchGame',
  async ({text = '', debouncedSearchTerm = '', order, filter}) => {
    const api = getApiSearchGame(text, debouncedSearchTerm, order, filter);
    try {
      const response = await axios.get(api);
      return response.data.results;
    } catch (e) {
      console.error(e);
    }
  },
);

const gameSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchGamesPerPage.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchGamesPerPage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.games = action.payload;
      })
      .addCase(fetchGamesPerPage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchGamesMore.pending, (state, action) => {
        state.moreLoading = 'loading';
      })
      .addCase(fetchGamesMore.fulfilled, (state, action) => {
        state.moreLoading = 'succeeded';
        state.games = state.games.concat(action.payload);
      })
      .addCase(fetchGamesMore.rejected, (state, action) => {
        state.moreLoading = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchPlatforms.fulfilled, (state, action) => {
        state.statusPlatforms = 'succeeded';
        state.platforms = action.payload;
      })
      .addCase(fetchSortedGames.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchSortedGames.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.games = action.payload;
      })
      .addCase(fetchSortedGames.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchFilteredGames.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchFilteredGames.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.games = action.payload;
      })
      .addCase(fetchFilteredGames.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchSearchGame.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchSearchGame.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.games = action.payload;
      })
      .addCase(fetchSearchGame.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const {} = gameSlice.actions;

export default gameSlice.reducer;
