import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { RootState } from '../store';
import { nanoid } from 'nanoid';

type ConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    setBun: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.bun = action.payload;
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      })
    },
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      })
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveIngredient(state, action: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = action.payload;
      const isOutOfRange =
        from < 0 ||
        from >= state.ingredients.length ||
        to < 0 ||
        to >= state.ingredients.length;
      if (!isOutOfRange) {
        const [movedItem] = state.ingredients.splice(from, 1);
        if (movedItem) {
          state.ingredients.splice(to, 0, movedItem);
        }
      }
    },
    clearConstructor(state) {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  setBun,
  addIngredient,
  removeIngredient,
  clearConstructor,
  moveIngredient
} = constructorSlice.actions;

export const selectConstructorItems = createSelector(
  (state: RootState) => (state as any).burgerConstructor,
  (constructor) => ({
    bun: constructor?.bun ?? null,
    ingredients: constructor?.ingredients ?? []
  })
);

export default constructorSlice.reducer;
