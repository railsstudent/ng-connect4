import { browser, by, element, ElementFinder } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  refresh() {
    return browser.refresh();
  }

  getShellTitle() {
    return element(by.css('connect-root .shell-title')).getText();
  }

  getTwoPlayersButton() {
    return element(by.css('connect-root .btn-human'));
  }

  getOnePlayerButton() {
    return element(by.css('connect-root .btn-computer'));
  }

  getFirstPlayer() {
    return element(by.tagName('connect-player:nth-of-type(1)'));
  }

  getSecondPlayer() {
    return element(by.tagName('connect-player:nth-of-type(2)'));
  }

  getFirstPlayerName() {
    return this.getFirstPlayer().$('.name').getText();
  }

  getFirstPlayerColor() {
    return this.getFirstPlayer().$('.piece').getCssValue('background-color');
  }

  getFirstPlayerTurn() {
    return this.getFirstPlayer().$$('.turn');
  }

  getSecondPlayerName() {
    return this.getSecondPlayer().$('.name').getText();
  }

  getSecondPlayerColor() {
    return this.getSecondPlayer().$('.piece').getCssValue('background-color');
  }

  getSecondPlayerTurn() {
    return this.getSecondPlayer().$$('.turn');
  }

  getBoard() {
    return element(by.tagName('connect-board'));
  }

  getBoardTitle(): string {
    return this.getBoard().$('.board-title').getText();
  }

  getBoardMovesLeftLabel(): string {
    return this.getBoard().$('.moves-left-label').getText();
  }

  getBoardMovesLeftContent(): string {
    return this.getBoard().$('.moves-left-content').getText();
  }

  getBoardGrid(): ElementFinder {
    return this.getBoard().$('.grid-container');
  }

  getBoardSelectionColumns(): ElementFinder {
    return this.getBoard().$('.select-column-container');
  }

  getBoardSelectionColumn(i: number): ElementFinder {
    return this.getBoard().$(`.select-column:nth-of-type(${i})`);
  }

  getOutcome() {
    return this.getBoard().$('.outcome');
  }

  getOutcomeText() {
    return this.getOutcome().getText();
  }

  getNewGameButton() {
    return this.getBoard().$('.btn-reset');
  }

  getBackToStartButton() {
    return this.getBoard().$('.btn-choose-mode');
  }

  getNumCells() {
    return {
      freeCell: $$('connect-board .grid-circle.free-cell').count(),
      player1: $$('connect-board .grid-circle.player1').count(),
      player2: $$('connect-board .grid-circle.player2').count(),
      computer: $$('connect-board .grid-circle.computer').count()
    };
  }
}
