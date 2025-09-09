import { createContext } from "react";

const boardContext = createContext({
  activeToolItem: "",
  elements: [],
  //Part4
  toolActionType: "", //It is imp because mouse move is after clicking at a point, board is not able to understand if i am drawing or stopped.
  //--Part 4
  changeToolHandler: () => {},
  boardMouseDownHandler: () => {},
  boardMouseMoveHandler: () => {},
  boardMouseUpHandler: () => {},
});
//Aab ye uper maine context bnai, aab iska provider bana dete hai-->Dusre file mei

export default boardContext;
