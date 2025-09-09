import React, { useReducer } from "react";
import boardContext from "./board-context";
import { BOARD_ACTIONS, TOOL_ACTION_TYPES, TOOL_ITEMS } from "../constants";

//Provider hai to children prop dalega hi

//Lect3

import rough from "roughjs/bin/rough";
const gen = rough.generator();

const boardReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_TOOL": {
      return {
        ...state,
        activeToolItem: action.payload.tool,
      };
    }
    //reducer ke andar se final coordinate ka state change kr rha hu, not in handleMouseDown
    case "DRAW_DOWN": {
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
        toolActionType: TOOL_ACTION_TYPES.DRAWING,
        elements: [...prevElements, newElement],
      };
    }
    //Part 4
    case "DRAW_MOVE": {
      //Here rather than pushing something to the states, like earlier we pushed initial (x,y), we will update the new coordinates on leaving the mouse click
      // if (state.elements.length === 0) {
      //   return state; // nothing to update
      // }
      const { clientX, clientY } = action.payload;
      const newElements = [...state.elements];
      const index = state.elements.length - 1;
      newElements[index].x2 = clientX;
      newElements[index].y2 = clientY;

      newElements[index].roughEle = gen.line(
        newElements[index].x1,
        newElements[index].y1,
        clientX,
        clientY
      );
      return {
        ...state,
        elements: newElements,
      };
    }
    case "DRAW_UP": {
      return {
        ...state,
        toolActionType: TOOL_ACTION_TYPES.NONE,
      };
    }
    //Part--4
    default:
      return state;
  }
};
const initialBoardState = {
  activeToolItem: TOOL_ITEMS.LINE,
  elements: [],

  //Part 4
  toolActionType: TOOL_ACTION_TYPES.NONE, //initially NONE hoga, baad mei mai jab click karunga, draw down hone pe toolActionType change krdo
  //--Part4
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

  const changeToolHandler = (tool) => {
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

  //Lect 4
  const boardMouseMoveHandler = (event) => {
    const { clientX, clientY } = event;
    // const roughEle = gen.line(clientX, clientY, clientX, clientY); //(x1,y1)initial ---- (x2,y2) final
    dispatchBoardAction({
      type: "DRAW_MOVE",
      payload: {
        clientX,
        clientY,
      },
    });
  };
  const boardMouseUpHandler = () => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.DRAW_UP,
    });
  };

  //--Lect 4

  const boardContextValue = {
    // activeToolItem, //After handling things with reducer instead of useStates, this we will give as
    activeToolItem: boardState.activeToolItem,
    elements: boardState.elements,
    boardMouseDownHandler,
    changeToolHandler,

    //Lect 4
    boardMouseMoveHandler,
    toolActionType: boardState.toolActionType,
    boardMouseUpHandler,
    //Lect--4
  };

  return (
    <boardContext.Provider value={boardContextValue}>
      {children}
    </boardContext.Provider>
  );
};

export default BoardProvider;
