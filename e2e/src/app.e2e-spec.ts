import { AppPage } from "./app.po";

describe("workspace-project App", () => {
  let page: AppPage;
  let originalTimeout;

  beforeEach(() => {
    page = new AppPage();
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it("should display enter game message", () => {
    page.navigateTo();
    expect(page.getShellTitle()).toEqual("Enter game of Connect Four");
  });

  it("should display show Human vs Human button", () => {
    page.navigateTo();
    expect(page.getTwoPlayersButton().getText()).toEqual("Human vs Human");
  });

  it("should display show Human vs Computer button", () => {
    page.navigateTo();
    expect(page.getOnePlayerButton().getText()).toEqual("Human vs Computer");
  });

  it("should show the game after clicking Human vs Human button", async () => {
    page.navigateTo();
    page.refresh();
    const btn = page.getTwoPlayersButton();
    await btn.click();
    expect(page.getFirstPlayerName()).toEqual("Player 1");
    expect(page.getFirstPlayerColor()).toEqual("rgba(255, 0, 0, 1)");
    expect(page.getFirstPlayerTurn().getText()).toEqual(["Your Turn.", "Please make a move"]);

    expect(page.getSecondPlayerName()).toEqual("Player 2");
    expect(page.getSecondPlayerColor()).toEqual("rgba(255, 255, 0, 1)");
    expect(await page.getSecondPlayerTurn().isPresent()).toBe(false);

    expect(page.getBoardTitle()).toBe("Connect Four Game");
    expect(page.getBoardMovesLeftLabel()).toBe("Remaining Moves:");
    expect(page.getBoardMovesLeftContent()).toEqual("42");
    expect(await page.getBoardGrid().isPresent()).toBe(true);
    expect(await page.getBoardSelectionContainer().isPresent()).toBe(true);
  });

  it("should show the game after clicking Human vs Computer button", async () => {
    page.navigateTo();
    page.refresh();
    const btn = page.getOnePlayerButton();
    await btn.click();
    expect(page.getFirstPlayerName()).toEqual("Player 1");
    expect(page.getFirstPlayerColor()).toEqual("rgba(255, 0, 0, 1)");
    expect(page.getFirstPlayerTurn().getText()).toEqual(["Your Turn.", "Please make a move"]);

    expect(page.getSecondPlayerName()).toEqual("Computer");
    expect(page.getSecondPlayerColor()).toEqual("rgba(255, 0, 255, 1)");
    expect(await page.getSecondPlayerTurn().isPresent()).toBe(false);

    expect(page.getBoardTitle()).toBe("Connect Four Game");
    expect(page.getBoardMovesLeftLabel()).toBe("Remaining Moves:");
    expect(page.getBoardMovesLeftContent()).toEqual("42");
    expect(await page.getBoardGrid().isPresent()).toBe(true);
    expect(await page.getBoardSelectionContainer().isPresent()).toBe(true);
  });

  it("should show player 1 wins", async () => {
    page.navigateTo();
    page.refresh();
    const btn = page.getTwoPlayersButton();
    await btn.click();

    const column1 = page.getBoardSelectionColumn(1);
    const column2 = page.getBoardSelectionColumn(2);

    await column1.click();
    await column2.click();
    await column1.click();
    await column2.click();
    await column1.click();
    await column2.click();
    await column1.click();

    expect(page.getOutcomeText()).toEqual("Player 1 wins!!!");
    expect(await page.getNewGameButton().isPresent()).toBe(true);
    expect(await page.getBackToStartButton().isPresent()).toBe(true);
    expect(page.getBoardMovesLeftContent()).toBe("35");
    const cells = page.getNumCells();
    expect(cells.freeCell).toEqual(35);
    expect(cells.player1).toEqual(4);
    expect(cells.player2).toEqual(3);
    expect(cells.computer).toEqual(0);
  });

  it("should show player 2 wins", async () => {
    page.navigateTo();
    page.refresh();
    const btn = page.getTwoPlayersButton();
    await btn.click();

    const column1 = page.getBoardSelectionColumn(1);
    const column2 = page.getBoardSelectionColumn(2);
    const column3 = page.getBoardSelectionColumn(3);
    const column4 = page.getBoardSelectionColumn(4);
    const column5 = page.getBoardSelectionColumn(5);

    await column1.click();
    await column2.click();
    await column1.click();
    await column3.click();
    await column2.click();
    await column4.click();
    await column2.click();
    await column5.click();

    expect(page.getOutcomeText()).toEqual("Player 2 wins!!!");
    expect(await page.getNewGameButton().isPresent()).toBe(true);
    expect(await page.getBackToStartButton().isPresent()).toBe(true);
    expect(page.getBoardMovesLeftContent()).toBe("34");
    const cells = page.getNumCells();
    expect(cells.freeCell).toEqual(34);
    expect(cells.player1).toEqual(4);
    expect(cells.player2).toEqual(4);
    expect(cells.computer).toEqual(0);
  });

  it("should show draw game", async () => {
    page.navigateTo();
    page.refresh();
    const btn = page.getTwoPlayersButton();
    await btn.click();

    const elColumns = page.getBoardSelectionColumns();
    const COLUMNS = 7;
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < COLUMNS - 1; j++) {
        await elColumns.get(j).click();
      }
    }

    for (let i = 2; i < 4; i++) {
      for (let j = COLUMNS - 2; j >= 0; j--) {
        await elColumns.get(j).click();
      }
    }

    for (let i = 4; i < 6; i++) {
      for (let j = 0; j < COLUMNS - 2; j++) {
        await elColumns.get(j).click();
      }
    }

    await elColumns.get(6).click();
    await elColumns.get(5).click();
    await elColumns.get(6).click();
    await elColumns.get(6).click();
    await elColumns.get(5).click();
    await elColumns.get(6).click();
    await elColumns.get(6).click();
    await elColumns.get(6).click();

    expect(page.getOutcomeText()).toEqual("Draw!!!");
    expect(await page.getNewGameButton().isPresent()).toBe(true);
    expect(await page.getBackToStartButton().isPresent()).toBe(true);
    expect(page.getBoardMovesLeftContent()).toBe("0");
    const cells = page.getNumCells();
    expect(cells.freeCell).toEqual(0);
    expect(cells.player1).toEqual(21);
    expect(cells.player2).toEqual(21);
    expect(cells.computer).toEqual(0);
  });

  it("should show start new game when button clicked", async () => {
    page.navigateTo();
    page.refresh();
    const btn = page.getTwoPlayersButton();
    await btn.click();

    const column1 = page.getBoardSelectionColumn(1);
    const column2 = page.getBoardSelectionColumn(2);

    await column1.click();
    await column2.click();
    await column1.click();
    await column2.click();
    await column1.click();
    await column2.click();
    await column1.click();

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
    expect(page.getBoardMovesLeftContent()).toEqual("42");
  });

  it("should show enter connect four when button clicked", async () => {
    page.navigateTo();
    page.refresh();
    const btn = page.getTwoPlayersButton();
    await btn.click();

    const column1 = page.getBoardSelectionColumn(1);
    const column2 = page.getBoardSelectionColumn(2);

    await column1.click();
    await column2.click();
    await column1.click();
    await column2.click();
    await column1.click();
    await column2.click();
    await column1.click();

    expect(await page.getBackToStartButton().isPresent()).toBe(true);
    await page.getBackToStartButton().click();

    expect(page.getShellTitle()).toEqual("Enter game of Connect Four");
    expect(page.getTwoPlayersButton().getText()).toEqual("Human vs Human");
    expect(page.getOnePlayerButton().getText()).toEqual("Human vs Computer");
  });
});
