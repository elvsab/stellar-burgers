import { describe, it, expect } from '@jest/globals';
import store, { rootReducer } from './store';

describe('root reducer initialization', () => {
  it('should initialize store with expected top-level keys', () => {
    const state = store.getState();
    const keys = Object.keys(state);
    expect(keys).toEqual(
      expect.arrayContaining([
        'ingredients',
        'burgerConstructor',
        'order',
        'user',
        'feeds',
        'userOrders',
        'orderDetails'
      ])
    );
  });

  it('should return initial state when passed an unknown action', () => {
    const initialState = store.getState();
    const action = { type: 'UNKNOWN_ACTION' };
    const newState = rootReducer(undefined, action);
    expect(newState).toEqual(initialState);
  });
});
