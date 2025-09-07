import { createContext } from "react";

const boardContext = createContext({
  activeToolItem: "",
  handleBoardMouseDown: () => {},
  handleToolItemClick: () => {},
  elements: [],
});
//Aab ye uper maine context bnai, aab iska provider bana dete hai-->Dusre file mei

export default boardContext;
