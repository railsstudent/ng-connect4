import { environment } from "../../environments/environment";
import { MinimaxSolver } from "./minimax-solver";

export { GameSolver } from "./game-solver";
export const createSolver = () => {
  if (environment.solver === "minimax") {
    return new MinimaxSolver();
  }
  return new MinimaxSolver();
};
