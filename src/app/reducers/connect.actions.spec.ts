import * as connectActions from "./connect.actions";
import { Mode, Player } from "../models";

fdescribe("Connect Actions", () => {
  describe("NewGameAction", () => {
    it("should create an action", () => {
      const action = new connectActions.NewGameAction();
      expect({ ...action }).toEqual({
        type: connectActions.ConnectActionTypes.NewGame
      });
    });
  });

  describe("PlayerOneMoveAction Human vs Human", () => {
    it("should create an action", () => {
      const action = new connectActions.PlayerOneMoveAction({
        mode: Mode.HUMAN_VS_HUMAN,
        player: Player.PLAYER1,
        column: 0
      });
      expect({ ...action }).toEqual({
        type: connectActions.ConnectActionTypes.Player1Move,
        payload: {
          mode: Mode.HUMAN_VS_HUMAN,
          player: Player.PLAYER1,
          column: 0
        }
      });
    });
  });

  describe("PlayerOneMoveAction Human vs Computer", () => {
    it("should create an action", () => {
      const action = new connectActions.PlayerOneMoveAction({
        mode: Mode.HUMAN_VS_COMPUTER,
        player: Player.PLAYER1,
        column: 0
      });
      expect({ ...action }).toEqual({
        type: connectActions.ConnectActionTypes.Player1Move,
        payload: {
          mode: Mode.HUMAN_VS_COMPUTER,
          player: Player.PLAYER1,
          column: 0
        }
      });
    });
  });

  describe("PlayerTwoMoveAction", () => {
    it("should create an action", () => {
      const action = new connectActions.PlayerTwoMoveAction({
        player: Player.PLAYER2,
        column: 0
      });
      expect({ ...action }).toEqual({
        type: connectActions.ConnectActionTypes.Player2Move,
        payload: { player: Player.PLAYER2, column: 0 }
      });
    });
  });

  describe("ComputerMoveAction", () => {
    it("should create an action", () => {
      const action = new connectActions.ComputerMoveAction({
        player: Player.COMPUTER,
        column: 0
      });
      expect({ ...action }).toEqual({
        type: connectActions.ConnectActionTypes.ComputerMove,
        payload: { player: Player.COMPUTER, column: 0 }
      });
    });
  });
});
