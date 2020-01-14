import * as connectActions from "./connect.actions";
import { Mode, Player } from "../models";

describe("Connect Actions", () => {
  describe("NewGameAction", () => {
    it("should create an action", () => {
      const action = connectActions.NewGameAction({
        mode: Mode.HUMAN_VS_HUMAN
      });
      expect({ ...action }).toEqual({
        mode: Mode.HUMAN_VS_HUMAN,
        type: connectActions.ConnectActionTypes.NewGame
      });
    });
  });

  describe("PlayerOneMoveAction Human vs Human", () => {
    it("should create an action", () => {
      const action = connectActions.PlayerOneMoveAction({
        mode: Mode.HUMAN_VS_HUMAN,
        player: Player.PLAYER1,
        column: 0
      });
      expect({ ...action }).toEqual({
        mode: Mode.HUMAN_VS_HUMAN,
        player: Player.PLAYER1,
        column: 0,
        type: connectActions.ConnectActionTypes.Player1Move
      });
    });
  });

  describe("PlayerOneMoveAction Human vs Computer", () => {
    it("should create an action", () => {
      const action = connectActions.PlayerOneMoveAction({
        mode: Mode.HUMAN_VS_COMPUTER,
        player: Player.PLAYER1,
        column: 0
      });
      expect({ ...action }).toEqual({
        mode: Mode.HUMAN_VS_COMPUTER,
        player: Player.PLAYER1,
        column: 0,
        type: connectActions.ConnectActionTypes.Player1Move
      });
    });
  });

  describe("PlayerTwoMoveAction", () => {
    it("should create an action", () => {
      const action = connectActions.PlayerTwoMoveAction({
        player: Player.PLAYER2,
        column: 0
      });
      expect({ ...action }).toEqual({
        player: Player.PLAYER2,
        column: 0,
        type: connectActions.ConnectActionTypes.Player2Move
      });
    });
  });

  describe("ComputerMoveAction", () => {
    it("should create an action", () => {
      const action = connectActions.ComputerMoveAction({
        player: Player.COMPUTER,
        column: 0
      });
      expect({ ...action }).toEqual({
        player: Player.COMPUTER,
        column: 0,
        type: connectActions.ConnectActionTypes.ComputerMove
      });
    });
  });

  describe("ChooseModeAction", () => {
    it("should create an action", () => {
      const action = connectActions.ChooseModeAction();
      expect({ ...action }).toEqual({
        type: connectActions.ConnectActionTypes.ChooseMode
      });
    });
  });
});
