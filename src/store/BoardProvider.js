import React, { useReducer } from "react";
import boardContext from "./board-context";
import { BOARD_ACTIONS, TOOL_ACTION_TYPES, TOOL_ITEMS } from "../constants";

//Provider hai to children prop dalega hi

//Lect3

import rough from "roughjs/bin/rough";

import { createRoughElement, getSvgPathFromStroke } from "../utils/elements";
import getStroke from "perfect-freehand"; //Installed perfect-freehand library first

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
      //   const { clientX, clientY, stroke, fill, size } = action.payload;

      //   //Part 5---Created a utils folder in which exporting createRoughEle function
      //   const newElement = createRoughElement(
      //     state.elements.length, //id
      //     clientX,
      //     clientY,
      //     clientX,
      //     clientY,
      //     { type: state.activeToolItem, stroke, fill, size }
      //   );

      //   // const newElement = {
      //   //   id: state.elements.length,
      //   //   x1: clientX,
      //   //   y1: clientY,
      //   //   //let for now x2 y2 bhi same hai
      //   //   x2: clientX,
      //   //   y2: clientY,
      //   //   roughEle: gen.line(clientX, clientY, clientX, clientY),
      //   // };
      //   const prevElements = state.elements;

      //   //element push
      //   return {
      //     ...state, //new state
      //     toolActionType: TOOL_ACTION_TYPES.DRAWING,
      //     elements: [...prevElements, newElement],
      //   };
      // }

      //I added brushTool size functionality also alongwith stroke - customised Me
      const { clientX, clientY, stroke, fill, size } = action.payload;
      const prevElements = state.elements;

      let newElement;

      if (state.activeToolItem === TOOL_ITEMS.BRUSH) {
        // Create a brush element with points, stroke, and size
        newElement = {
          id: state.elements.length,
          type: TOOL_ITEMS.BRUSH,
          points: [{ x: clientX, y: clientY }],
          stroke,
          size,
          path: new Path2D(), // initialize path
        };
      } else {
        // Default for rough.js shapes
        newElement = createRoughElement(
          state.elements.length,
          clientX,
          clientY,
          clientX,
          clientY,
          { type: state.activeToolItem, stroke, fill, size }
        );
      }

      return {
        ...state,
        toolActionType:
          state.activeToolItem === TOOL_ITEMS.ERASER
            ? TOOL_ACTION_TYPES.ERASING
            : TOOL_ACTION_TYPES.DRAWING,
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
      //P5
      const { type } = newElements[index]; //destructure karke last stored element mei se xq, y1 nikaal liya, final is clientX and clientY
      // newElements[index].x2 = clientX;
      // newElements[index].y2 = clientY;

      // newElements[index].roughEle = gen.line(
      //   newElements[index].x1,
      //   newElements[index].y1,
      //   clientX,
      //   clientY
      //);
      //P5
      //P10
      if (
        type === TOOL_ITEMS.LINE ||
        type === TOOL_ITEMS.CIRCLE ||
        type === TOOL_ITEMS.RECTANGLE ||
        type === TOOL_ITEMS.ARROW
      ) {
        const { x1, y1, stroke, fill, size } = newElements[index];
        const newElement = createRoughElement(index, x1, y1, clientX, clientY, {
          type: state.activeToolItem,
          stroke,
          fill,
          size,
        });
        newElements[index] = newElement;
        return {
          ...state,
          elements: newElements,
        };
      } else if (type === TOOL_ITEMS.BRUSH) {
        newElements[index].points = [
          ...newElements[index].points,
          { x: clientX, y: clientY },
        ];
        newElements[index].path = new Path2D(
          getSvgPathFromStroke(getStroke(newElements[index].points))
        );
        return {
          ...state,
          elements: newElements,
        };
      } else {
        return {
          ...state,
        };
      }
      //--P10

      // const newElement = createRoughElement(index, x1, y1, clientX, clientY, {
      //   type: state.activeToolItem,
      //   stroke,
      //   fill,
      //   size,
      // });
      // newElements[index] = newElement;
      // //--P5
      // return {
      //   ...state,
      //   elements: newElements,
      // };
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
  const boardMouseDownHandler = (event, toolboxState) => {
    const { clientX, clientY } = event;
    // const roughEle = gen.line(clientX, clientY, clientX, clientY); //(x1,y1)initial ---- (x2,y2) final
    dispatchBoardAction({
      type: "DRAW_DOWN",
      payload: {
        clientX,
        clientY,
        stroke: toolboxState[boardState.activeToolItem]?.stroke,
        fill: toolboxState[boardState.activeToolItem]?.fill,
        size: toolboxState[boardState.activeToolItem]?.size,
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

  //Movehandler mei move karte time hum ye bhi dekhna hai ki mai draw kar raha hu ya erase, to uske liye mai toolActionType banaunga reducer mei and uske hisab se mai move handler ko call karunga ya nahi
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
