import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector
} from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '@utils-types';
import { RootState } from '../store';

type IngredientsState = {
  items: TIngredient[];
  isLoading: boolean;
  error: string | null;
  selectedIngredient: TIngredient | null;
};

const initialState: IngredientsState = {
  items: [],
  isLoading: false,
  error: null,
  selectedIngredient: null
};

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchIngredients', async (_, { rejectWithValue }) => {
  try {
    const data = await getIngredientsApi();
    return data;
  } catch (err) {
    return rejectWithValue('Не удалось загрузить ингредиенты');
  }
});

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setSelectedIngredient(state, action: PayloadAction<TIngredient>) {
      state.selectedIngredient = action.payload;
    },
    clearSelectedIngredient(state) {
      state.selectedIngredient = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.items = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Ошибка загрузки';
      });
  }
});

export const { setSelectedIngredient, clearSelectedIngredient } =
  ingredientsSlice.actions;

export const selectSelectedIngredient = (state: RootState) =>
  state.ingredients.selectedIngredient;

export default ingredientsSlice.reducer;

export const selectIngredientsState = (state: RootState) => state.ingredients;
export const selectAllIngredients = (state: RootState) =>
  state.ingredients.items;
export const selectIsLoading = (state: RootState) =>
  state.ingredients.isLoading;
export const selectError = (state: RootState) => state.ingredients.error;

export const selectBuns = createSelector(
  [selectAllIngredients],
  (items: TIngredient[]) => items.filter((i) => i.type === 'bun')
);

export const selectMains = createSelector(
  [selectAllIngredients],
  (items: TIngredient[]) => items.filter((i) => i.type === 'main')
);

export const selectSauces = createSelector(
  [selectAllIngredients],
  (items: TIngredient[]) => items.filter((i) => i.type === 'sauce')
);
