import { describe, it, expect } from '@jest/globals';
import reducer, {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './constructorSlice';
import { TIngredient } from '@utils-types';

type State = ReturnType<typeof reducer>;

const bun: TIngredient = {
  _id: 'bun-1',
  name: 'Булка',
  type: 'bun',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 100,
  image: '',
  image_large: '',
  image_mobile: ''
};

const main: TIngredient = {
  _id: 'main-1',
  name: 'Начинка',
  type: 'main',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 50,
  image: '',
  image_large: '',
  image_mobile: ''
};

describe('constructor slice reducer', () => {
  it('should handle addIngredient (add filling)', () => {
    const state1 = reducer(undefined, addIngredient(main));
    expect(state1.ingredients.length).toBe(1);
    expect(state1.ingredients[0]._id).toBe('main-1');
  });

  it('should handle setBun (add bun)', () => {
    const state = reducer(undefined, setBun(bun));
    expect(state.bun?._id).toBe('bun-1');
  });

  it('should handle removeIngredient', () => {
    let s: State = reducer(undefined, addIngredient(main));
    s = reducer(s, addIngredient({ ...main, _id: 'main-2' }));
    const idToRemove = s.ingredients[0].id;
    const after = reducer(s, removeIngredient(idToRemove));
    expect(after.ingredients.length).toBe(1);
  });

  it('should handle moveIngredient (reorder fillings)', () => {
    let s: State = reducer(undefined, addIngredient({ ...main, _id: 'm1' }));
    s = reducer(s, addIngredient({ ...main, _id: 'm2' }));
    s = reducer(s, addIngredient({ ...main, _id: 'm3' }));
    const from = 0;
    const to = 2;
    const moved = reducer(s, moveIngredient({ from, to }));
    expect(moved.ingredients.map((i: any) => i._id)).toEqual([
      'm2',
      'm3',
      'm1'
    ]);
  });

  it('should clear constructor', () => {
    let s: State = reducer(undefined, setBun(bun));
    s = reducer(s, addIngredient(main));
    const after = reducer(s, clearConstructor());
    expect(after.bun).toBeNull();
    expect(after.ingredients.length).toBe(0);
  });
});
