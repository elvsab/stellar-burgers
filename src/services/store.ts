import { configureStore } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredientsSlice';
import constructorReducer from './slices/constructorSlice';
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice';
import feedsReducer from './slices/feedsSlice';
import userOrdersReducer from './slices/userOrdersSlice';
import orderDetailsReducer from './slices/orderDetailsSlice';
import { createLogger } from 'redux-logger';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const logger = createLogger();

const rootReducer = {
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  user: userReducer,
  feeds: feedsReducer,
  userOrders: userOrdersReducer,
  orderDetails: orderDetailsReducer
};

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['burgerConstructor'],
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredActionPaths: ['meta.arg', 'meta.baseQueryMeta']
      }
    }).concat(logger)
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = dispatchHook as () => AppDispatch;
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
