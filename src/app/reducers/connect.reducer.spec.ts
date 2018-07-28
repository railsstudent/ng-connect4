import { connectReducer, initialState } from './connect.reducer';

describe('Game Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = connectReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
