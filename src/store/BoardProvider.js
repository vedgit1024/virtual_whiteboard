import React, { useReducer } from "react";
import boardContext from "./board-context";
import { TOOL_ITEMS } from "../constants";

//Provider hai to children prop dalega hi

//Lect3

import rough from "roughjs/bin/rough";
const gen = rough.generator();

const boardReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_TOOL":
      return {
        ...state,
        activeToolItem: action.payload.tool,
      };

    //reducer ke andar se final coordinate ka state change kr rha hu, not in handleMouseDown
    case "DRAW_DOWN":
      const { clientX, clientY } = action.payload;
      const newElement = {
        id: state.elements.length,
        x1: clientX,
        y1: clientY,
        //let for now x2 y2 bhi same hai
        x2: clientX,
        y2: clientY,
        roughEle: gen.line(clientX, clientY, clientX, clientY),
      };
      const prevElements = state.elements;

      //element push
      return {
        ...state, //new state
        elements: [...prevElements, newElement],
      };
    default:
      return state;
  }
};
const initialBoardState = {
  activeToolItem: TOOL_ITEMS.LINE,
  elements: [],
};
//--Lect3

const BoardProvider = ({ children }) => {
  //Lect 3
  const [boardState, dispatchBoardAction] = useReducer(
    boardReducer,
    initialBoardState
  );

  //--Lect 3
  // const [activeToolItem, setActiveToolItem] = useState(TOOL_ITEMS.LINE);

  //Now since useState uper comment out kr diya to use Reducer, we will not set the tool as we have done below, instead we will dispatch action

  const handleToolItemClick = (tool) => {
    // setActiveToolItem(tool);

    dispatchBoardAction({
      type: "CHANGE_TOOL", //Will define this in constants.js
      payload: {
        tool,
      },
    });
  };

  //To handle elements new pushes, kyuki mujhe states change krni thi mouse drop krne p, wo mai provider ke andar hi kar paunga
  const boardMouseDownHandler = (event) => {
    const { clientX, clientY } = event;
    // const roughEle = gen.line(clientX, clientY, clientX, clientY); //(x1,y1)initial ---- (x2,y2) final
    dispatchBoardAction({
      type: "DRAW_DOWN",
      payload: {
        clientX,
        clientY,
      },
    });
  };

  const boardContextValue = {
    // activeToolItem, //After handling things with reducer instead of useStates, this we will give as
    activeToolItem: boardState.activeToolItem,
    elements: boardState.elements,
    boardMouseDownHandler,
    handleToolItemClick,
  };

  return (
    <boardContext.Provider value={boardContextValue}>
      {children}
    </boardContext.Provider>
  );
};

export default BoardProvider;
