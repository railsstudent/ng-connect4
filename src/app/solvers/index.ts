import { environment } from "../../environments/environment";
import { MinimaxSolver } from "./minimax-solver";
import { MINI_MAX, ALPHA_BETA } from "./game-solver";

export { GameSolver } from "./game-solver";

export const createSolver = () => {
  if (environment.solver === MINI_MAX) {
    return new MinimaxSolver();
  } else if (environment.solver === ALPHA_BETA) {
    return new MinimaxSolver();
  }
  return new MinimaxSolver();
};
