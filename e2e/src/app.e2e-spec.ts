import { AppPage } from './app.po';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display enter game message', () => {
    page.navigateTo();
    expect(page.getShellTitle()).toEqual('Enter game of Connect Four');
  });

  it('should display show Human vs Human button', () => {
    page.navigateTo();
    expect(page.getTwoPlayersButton().getText()).toEqual('Human vs Human');
  });

  it('should display show Human vs Computer button', () => {
    page.navigateTo();
    expect(page.getOnePlayerButton().getText()).toEqual('Human vs Computer');
  });

  it('should show the game after clicking Human vs Human button', async () => {
    page.navigateTo();
    page.refresh();
    const btn = page.getTwoPlayersButton();
    await btn.click();
    expect(page.getFirstPlayerName()).toEqual('Player 1');
    expect(page.getFirstPlayerColor()).toEqual('rgba(255, 0, 0, 1)');
    expect(page.getFirstPlayerTurn().getText()).toEqual(['Your Turn.', 'Please make a move']);

    expect(page.getSecondPlayerName()).toEqual('Player 2');
    expect(page.getSecondPlayerColor()).toEqual('rgba(255, 255, 0, 1)');
    expect(await page.getSecondPlayerTurn().isPresent()).toBe(false);

    expect(page.getBoardTitle()).toBe('Connect Four Game');
    expect(page.getBoardMovesLeftLabel()).toBe('Remaining Moves:');
    expect(page.getBoardMovesLeftContent()).toEqual('42');
    expect(await page.getBoardGrid().isPresent()).toBe(true);
    expect(await page.getBoardSelectionColumns().isPresent()).toBe(true);
  });

  it('should show the game after clicking Human vs Computer button', async () => {
    page.navigateTo();
    page.refresh();
    const btn = page.getOnePlayerButton();
    await btn.click();
    expect(page.getFirstPlayerName()).toEqual('Player 1');
    expect(page.getFirstPlayerColor()).toEqual('rgba(255, 0, 0, 1)');
    expect(page.getFirstPlayerTurn().getText()).toEqual(['Your Turn.', 'Please make a move']);

    expect(page.getSecondPlayerName()).toEqual('Computer');
    expect(page.getSecondPlayerColor()).toEqual('rgba(255, 0, 255, 1)');
    expect(await page.getSecondPlayerTurn().isPresent()).toBe(false);

    expect(page.getBoardTitle()).toBe('Connect Four Game');
    expect(page.getBoardMovesLeftLabel()).toBe('Remaining Moves:');
    expect(page.getBoardMovesLeftContent()).toEqual('42');
    expect(await page.getBoardGrid().isPresent()).toBe(true);
    expect(await page.getBoardSelectionColumns().isPresent()).toBe(true);
  });

  it('should show player 1 wins', async () => {
    page.navigateTo();
    page.refresh();
    const btn = page.getTwoPlayersButton();
    await btn.click();

    const column1 = page.getBoardSelectionColumn(1);
    const column2 = page.getBoardSelectionColumn(2);

    const promises = [column1, column2, column1, column2, column1, column2, column1].map(c => c.click());
    await Promise.all(promises);

    expect(page.getOutcomeText()).toEqual('Player 1 wins!!!');
    expect(await page.getNewGameButton().isPresent()).toBe(true);
    expect(await page.getBackToStartButton().isPresent()).toBe(true);
    expect(page.getBoardMovesLeftContent()).toBe('35');
    const cells = page.getNumCells();
    expect(cells.freeCell).toEqual(35);
    expect(cells.player1).toEqual(4);
    expect(cells.player2).toEqual(3);
    expect(cells.computer).toEqual(0);
  });

  it('should show player 2 wins', async () => {
    page.navigateTo();
    page.refresh();
    const btn = page.getTwoPlayersButton();
    await btn.click();

    const column1 = page.getBoardSelectionColumn(1);
    const column2 = page.getBoardSelectionColumn(2);
    const column3 = page.getBoardSelectionColumn(3);
    const column4 = page.getBoardSelectionColumn(4);
    const column5 = page.getBoardSelectionColumn(5);

    const promises = [column1, column2, column1, column3, column2, column4, column2, column5].map(c => c.click());
    await Promise.all(promises);

    expect(page.getOutcomeText()).toEqual('Player 2 wins!!!');
    expect(await page.getNewGameButton().isPresent()).toBe(true);
    expect(await page.getBackToStartButton().isPresent()).toBe(true);
    expect(page.getBoardMovesLeftContent()).toBe('34');
    const cells = page.getNumCells();
    expect(cells.freeCell).toEqual(34);
    expect(cells.player1).toEqual(4);
    expect(cells.player2).toEqual(4);
    expect(cells.computer).toEqual(0);
  });

  it('should show start new game when button clicked', async () => {
    page.navigateTo();
    page.refresh();
    const btn = page.getTwoPlayersButton();
    await btn.click();

    const column1 = page.getBoardSelectionColumn(1);
    const column2 = page.getBoardSelectionColumn(2);

    const promises = [column1, column2, column1, column2, column1, column2, column1].map(c => c.click());
    await Promise.all(promises);

    expect(await page.getNewGameButton().isPresent()).toBe(true);
    await page.getNewGameButton().click();

    expect(await page.getOutcome().isPresent()).toBe(false);
    expect(await page.getNewGameButton().isPresent()).toBe(false);
    expect(await page.getBackToStartButton().isPresent()).toBe(false);
    const cells = page.getNumCells();
    expect(cells.freeCell).toEqual(42);
    expect(cells.player1).toEqual(0);
    expect(cells.player2).toEqual(0);
    expect(cells.computer).toEqual(0);
    expect(page.getBoardMovesLeftContent()).toEqual('42');
  });
});
