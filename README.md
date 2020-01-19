# NgConnect4

[![Netlify Status](https://api.netlify.com/api/v1/badges/6fc529e8-6c52-4f03-863a-56fee7be025b/deploy-status)](https://app.netlify.com/sites/thirsty-shockley-169e63/deploys)

Reference:
* [Wikipedia of MiniMax](https://en.wikipedia.org/wiki/Minimax)
* [Wikipedia of Alpha Beta Pruning](https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning)
* Evaluation function copied from this StackOverflow post. https://softwareengineering.stackexchange.com/questions/263514/why-does-this-evaluation-function-work-in-a-connect-four-game-in-java
* Study other JS implementation of connect 4. https://github.com/Gimu/connect-four-js/

## Problem Statement

This application is a Connect 4 game that can play between two human players or play against computer component. The size of the board is 7 x 6 and each person can place 21 pieces to it at most. When it is in Human vs Human mode, each player takes turn to insert a piece in a column until one player wins first or the board results to a draw. Afterward, players can reset game or return to start page to choose another mode to play. Similarly, a person plays against computer in Human vs Computer mode that results to either a win or a draw. After the game ends, player can reset game or return to start page.

## Architecture

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.0.

The architecture of the project is Angular 6 with NGRx 6 for state management.

I choose to use a NGRX Store to store state:
* The player round (Human or Computer)
* Number of remaining moves
* Outcome of the game (Player 1 wins, Player 2 wins, Computer wins, Draw)
* State of the board
* Columns that are not full
* If the game is won by someone, draw line across the winning sequence of 4 pieces

Similar to React redux pattern, reducer function accepts NGRX action and returns the next state of the game.
Selectors query data from the store and update the underlying observables.

Components that subscribe to the observables are notified and rendered the HTML templates according to their values.

### Components

The game is a small application that is consisted of three components: Shell Component, Player Component and Board Component.

Shell Component serves as a shell app that hosts two instances of Player component and an instance of Board component. Depends on chosen mode,  different arguments are passed to Player Components to display name and color of the piece.

Player Component represents player of the game.  It can be either a human or computer. It is a small component that displays name, the color of the piece and additional texts to indicate who's round to place new piece on the board.

Board Component represents the 7x6 board that is used in the game.  It renders the board and the pieces on it, prints number of remaining moves, declares winner of the game and draws a line when connected 4 exists.

```
# Simplified project structure
--- dist/
--- e2e/
--- src/
   --- app
        --- board
            --- board.component.html
            --- board.component.scss
            --- board.component.spec.ts
            --- board.component.ts
        --- player
            --- player.component.html
            --- player.component.scss
            --- player.component.spec.ts
            --- player.component.ts
        --- shell
            --- shell.component.html
            --- shell.component.scss
            --- shell.component.spec.ts
            --- shell.component.ts
        --- reducers/    # NGRX 6
        --- solvers/     # MiniMax with Alpha Beta pruning
        --- util/
   --- index.html
```

## Technology Stack
* `Angular 6`
* `SCSS`   - style all the components in the application
* `TypeScript` - logic of controllers, solver and utilities are written in TypeScript
* `NGRX 6` - maintain state management of the application
* `Jasmine` - write unit test cases, component test cases, NGRX action test cases, selector test cases and reducer test cases
* `Karma` - execute unit tests
* `Protractor` - execute e2e test to verify DOM elements are rendered correctly in Human vs Human mode
* `Prettier` and `Husky` - format source files in pre-commit husky hook before git commit

## Live Site
https://thirsty-shockley-169e63.netlify.com/

## Github Repository
https://github.com/railsstudent/ng-connect4/

## Software Requirements
- node 8.11.3
- Angular CLI v6.1.3

## Development server

Install dependencies

 ```javascript
    # with npm
    npm install

    # or with yarn
    yarn install
```

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Development build

 ```javascript
    ng build
```

Production build

 ```javascript
    # with npm
    npm run build-prod

    # or with yarn
    yarn build-prod
```

The build artifacts will be stored in the `dist/ng-connect4` directory.

## Run production build locally

 ```javascript
    # with npm
    npm run start:prod

    # or with yarn
    yarn start:prod
```

Navigate to `http://localhost:8000/`.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running unit tests in single run

 ```javascript
    # with npm
    npm run sr-tests

    # or with yarn
    yarn sr-tests
```

## Running end-to-end tests

Run `ng e2e --port=4201` to execute the end-to-end tests in port 4201 via [Protractor](http://www.protractortest.org/).

## Running Code Coverage
 ```javascript
    # with npm
    npm run code-coverage

    # or with yarn
    yarn code-coverage
```
Start local server to display code coverage results in html format

 ```javascript
    # with npm
    npm run start:coverage

    # or with yarn
    yarn start:coverage
```
Navigate to `http://localhost:8001/`.

## Swap different AI strategy
1. Create new solver that implements `GameSolver` interface in `solvers/` folder
2. Open `solvers/index.ts` and append new type to `SolverType`
   ``` javascript
    export type SolverType = AlphabetaSolver | MinimaxSolver | OtherSolver;

   ```
3. Open `src/environments` folder to edit `environment.ts` and `environment.prod.ts` files
    - Replace the value of solver property to a meaningful name
    ```javascript
    export const environment = {
        ...
        solver: "other solver",
        ...
    };
    ```
4. Update createSolver function in `solvers/index.ts` file. Add a new else-if clause to create the new solver (return new OtherSolver() in our example).
    ```javascript
    export const createSolver = () => {
        if (environment.solver === 'xxxx') {
            return new DefaultSolver();
        } else if (environment.solver === 'other solver') {
            return new OtherSolver();
        }
        return new DefaultSolver();
    };
    ```

## Deployment to Netlify
### First deployment
1. Login https://www.netlify.com/
2. If it is first-time deployment, click `New Site From Git` button
3. Choose `Github` under Continuous Deployment
4. Choose `master` branch to deploy
5. Input `npm run build-prod` in Build command textbox
6. Input `dist/ng-connect4` in publish directory textbox
7. Expand Advanced build settings to add API Key of Pixabay. Key is 'API_KEY' and value is the API Key in your `.env` file.
8. Click `Deploy site` button and wait for the code to push to netlify hosting

### Further deployment
1. Netlify auto-deploy from Github to production site when new code is pushed to master branch in remote repository.

# Area of Improvements
1. The alphabeta pruning search is slow when depth is increased to 4 and it is not nearly perfect and human player can win close to 50% of the time.
2. There may be race condition in human vs computer game where computer makes two consecutive moves and the game stalls. If user refreshes browser to restart the game, the bug goes away.
3. The name of players are hard-coded to 'Player 1', 'Player 2' and 'Computer', they can be customized if more effort is spent.
4. Add a ranking table to list the top results of human players and computer. The collected data can be analysed to measure the performance of the AI search strategy and how tough to defeat the computer.
5. The game can be further enhanced to play in different devices instead of the same device.  One way to do so is to set up a websocket server that sends messages to update NGRX store. When observable receives the new updates, they can notify Angular components to render their templates

## Open Source Project
1. [Codebuddies Repo](https://github.com/railsstudent/codebuddies)
    * One of the primary code contributors of the project. Contributes to UI changes, meteor backend codes and CRUD operations in MongoDB
    * [Live site](https://codebuddies.org/)

## Some Angular exercises of mine
1. [Lazy load memes in Angular](https://stackblitz.com/edit/ng-lazy-load-memes)
    * Apply Intersection Observer API to lazy load memes in Angular App
2. [Custom number counter component](https://github.com/railsstudent/show-me-the-code)
    * Demo code for Show Me the Code meetup that was held on August 3, 2018.
    * Use Angular Element v6.1.1 to create a custom counter element that increements and decrements by 1.
    * Google Angular team makes improvements such that can run in FireFox and Safari with ShadowDOM polyfill
3. [Ng Periodic Table](https://railsstudent.github.io/ng-periodic-table/)
    * Build a dynamic period table similar to ptable.com
    * In the development process, I gained better understanding of Angular lifecylce hooks and Angular change detection.
    * [Github Page](https://github.com/railsstudent/ng-periodic-table)
