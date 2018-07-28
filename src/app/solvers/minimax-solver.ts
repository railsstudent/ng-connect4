import { GameSolver } from './game-solver';
import { GridUtil } from '../util/grid.util';

export class MinimaxSolver implements GameSolver {
                gridUtil = new GridUtil();

        setGrid(grid: string[]) {
        this.gridUtil.setGrid     (grid);
    }

    bestScore(): number {
        throw new Error('Method not implemented.');
    }

    bestMove(): [number, number] {
        throw new Error('Method not implemented.');
    }
}
