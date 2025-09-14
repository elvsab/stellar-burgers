import { describe, it, expect } from '@jest/globals';
import reducer, { fetchIngredients } from './ingredientsSlice';

describe('ingredients slice reducers (pending/fulfilled/rejected)', () => {
  it('sets isLoading true on pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = reducer(undefined, action as any);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('writes data and sets isLoading false on fulfilled', () => {
    const payload = [
      {
        _id: 'i1',
        name: 'Ing 1',
        type: 'main',
        proteins: 0,
        fat: 0,
        carbohydrates: 0,
        calories: 0,
        price: 1,
        image: '',
        image_large: '',
        image_mobile: ''
      }
    ];
    const action = { type: fetchIngredients.fulfilled.type, payload };
    const state = reducer(undefined, action as any);
    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(payload);
  });

  it('writes error and sets isLoading false on rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      payload: 'Не удалось загрузить ингредиенты'
    };
    const state = reducer(undefined, action as any);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Не удалось загрузить ингредиенты');
  });
});
