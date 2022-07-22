import {configureStore} from '@reduxjs/toolkit';
import gamesReducer from '../redux/gameSlice';
import detailsReducer from '../redux/detailGameSlice';

export default configureStore({
  reducer: {
    games: gamesReducer,
    details: detailsReducer,
  },
});
