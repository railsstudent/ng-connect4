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
    expect(await page.getSecondPlayerTurn().isPresent()).toBeFalsy();

    expect(page.getBoardTitle()).toBe('Connect Four Game');
    expect(page.getBoardMovesLeftLabel()).toBe('Remaining Moves:');
    expect(page.getBoardMovesLeftContent()).toEqual('42');
    expect(await page.getBoardGrid().isPresent()).toBeTruthy();
    expect(await page.getBoardSelectionColumns().isPresent()).toBeTruthy();
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
    expect(await page.getSecondPlayerTurn().isPresent()).toBeFalsy();

    expect(page.getBoardTitle()).toBe('Connect Four Game');
    expect(page.getBoardMovesLeftLabel()).toBe('Remaining Moves:');
    expect(page.getBoardMovesLeftContent()).toEqual('42');
    expect(await page.getBoardGrid().isPresent()).toBeTruthy();
    expect(await page.getBoardSelectionColumns().isPresent()).toBeTruthy();
  });
});
