import React, { act, useReducer } from "react";
import boardContext from "./board-context";
import { BOARD_ACTIONS, TOOL_ACTION_TYPES, TOOL_ITEMS } from "../constants";

//Provider hai to children prop dalega hi

//Lect3

import rough from "roughjs/bin/rough";

import { createElement, getSvgPathFromStroke } from "../utils/elements";
import getStroke from "perfect-freehand"; //Installed perfect-freehand library first

import { isPointNearElement } from "../utils/elements";

const gen = rough.generator();

const boardReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_TOOL": {
      return {
        ...state,
        activeToolItem: action.payload.tool,
      };
    }
    case BOARD_ACTIONS.CHANGE_ACTION_TYPE: {
      return {
        ...state,
        toolActionType: action.payload.actionType,
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
        newElement = createElement(
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
          state.activeToolItem === TOOL_ITEMS.TEXT
            ? TOOL_ACTION_TYPES.WRITING //Ab writing mode mei chala jao agar mai text element laaunga yaha pe
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
        const newElement = createElement(index, x1, y1, clientX, clientY, {
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
    // case "DRAW_UP": {
    //   return {
    //     ...state,
    //     toolActionType: TOOL_ACTION_TYPES.NONE,
    //   };
    // } ------->>>>>>>>>Now aab iski zarurat nahi hai, kyuki mai mouse up hone pe bhi toolActionType ko NONE kr dunga

    //P14
    case BOARD_ACTIONS.DRAW_UP: {
      const elementsCopy = [...state.elements];
      const newHistory = state.history.slice(0, state.index + 1); //Aabhi tak ki history ko le lo, uske aage wali history ko hata do
      //Agar mai koi naya element draw karunga to uske aage wali history ki koi value nahi honi chahiye, kyuki undo redo ka logic to wahi kaam karega
      //So isliye mai slice kar ke nayi history banaunga jisme sirf abhi tak ki history hogi, uske aage wali nahi hogi
      //Agar mai koi naya element draw karunga to uske aage wali history ki koi value nahi honi chahiye, kyuki undo redo ka logic to wahi kaam karega
      //So isliye mai slice kar ke nayi history banaunga jisme sirf abhi tak ki history hogi, uske aage wali nahi hogi

      newHistory.push(elementsCopy); //Fir usme mai current elements ko push kar dunga
      return {
        ...state,
        history: newHistory,
        index: state.index + 1,
      };
    }
    //P--14

    //P11
    case BOARD_ACTIONS.ERASE: {
      const { clientX, clientY } = action.payload;
      let newElements = [...state.elements];
      newElements = newElements.filter((element) => {
        return !isPointNearElement(element, clientX, clientY);
      });

      // const newHistory = state.history.slice(0, state.index + 1); //Aabhi tak ki history ko le lo, uske aage wali history ko hata do
      // newHistory.push(newElements);
      return {
        ...state,
        elements: newElements,
        // history: newHistory,
        // index: state.index + 1,
      };
    }
    //P--11
    //Part--4

    //P13
    case BOARD_ACTIONS.CHANGE_TEXT: {
      const index = state.elements.length - 1;
      const newElements = [...state.elements];
      newElements[index].text = action.payload.text;

      //P14
      const newHistory = state.history.slice(0, state.index + 1);
      newHistory.push(newElements);
      //--P14

      return {
        ...state,
        toolActionType: TOOL_ACTION_TYPES.NONE, //as mai aab blur kar diya hu that is text ko canvas pe add karne ke baad, so ab mai toolActionType ko NONE kr dunga.
        elements: newElements,
        //P14
        history: newHistory,
        index: state.index + 1,
        //--P14
      };
    }
    //P--13

    //P14
    case BOARD_ACTIONS.UNDO: {
      if (state.index <= 0) return state; //Agar index 0 hai to kuch nahi karna, kyuki aur peeche nahi ja sakte
      return {
        ...state,
        elements: state.history[state.index - 1],
        index: state.index - 1,
      };
    }

    case BOARD_ACTIONS.REDO: {
      if (state.index >= state.history.length - 1) return state; //Agar index 0 hai to kuch nahi karna, kyuki aur peeche nahi ja sakte
      return {
        ...state,
        elements: state.history[state.index + 1],
        index: state.index + 1,
      };
    }
    //--P14
    default:
      return state;
  }
};
const initialBoardState = {
  activeToolItem: TOOL_ITEMS.BRUSH, //initially brush select hoga
  elements: [],

  //Part 4
  toolActionType: TOOL_ACTION_TYPES.NONE, //initially NONE hoga, baad mei mai jab click karunga, draw down hone pe toolActionType change krdo
  //--Part4

  //P14
  //History and index states for undo redo
  history: [[]], //Initially history has one array which is empty
  index: 0, //Initially index is 0
  //P--14
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
    //P13
    // if (boardState.activeToolItem === TOOL_ITEMS.TEXT) {
    //   dispatchBoardAction({
    //     type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
    //     payload: {
    //       actionType: TOOL_ACTION_TYPES.WRITING,
    //     },
    //   });

    // }
    if (boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return;
    //--P13
    const { clientX, clientY } = event;
    // const roughEle = gen.line(clientX, clientY, clientX, clientY); //(x1,y1)initial ---- (x2,y2) final

    //P11
    if (boardState.activeToolItem === TOOL_ITEMS.ERASER) {
      dispatchBoardAction({
        type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
        payload: {
          actionType: TOOL_ACTION_TYPES.ERASING,
        },
      });
      return;
    }

    //--P11
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
    if (boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return; //Agar toolActionType WRITING hai to move handler ko call mat karo, kyuki text area pe click karne ke baad bhi mouse move hoga to wo bhi call ho jayega, jo ki nahi chahiye

    const { clientX, clientY } = event;
    // const roughEle = gen.line(clientX, clientY, clientX, clientY); //(x1,y1)initial ---- (x2,y2) final
    if (boardState.toolActionType === TOOL_ACTION_TYPES.DRAWING) {
      dispatchBoardAction({
        type: "DRAW_MOVE",
        payload: {
          clientX,
          clientY,
        },
      });
    } else if (boardState.toolActionType === TOOL_ACTION_TYPES.ERASING) {
      //Eraser logic
      dispatchBoardAction({
        type: BOARD_ACTIONS.ERASE,
        payload: {
          clientX,
          clientY,
        },
      });
    }
  };

  //Movehandler mei move karte time hum ye bhi dekhna hai ki mai draw kar raha hu ya erase, to uske liye mai toolActionType banaunga reducer mei and uske hisab se mai move handler ko call karunga ya nahi
  const boardMouseUpHandler = () => {
    //P13
    if (boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return;
    //--P13

    //P14
    if (boardState.toolActionType === TOOL_ACTION_TYPES.DRAWING) {
      dispatchBoardAction({
        type: BOARD_ACTIONS.DRAW_UP,
      });
      //Aab jaunga reducer mei iss case banaunga jisme mai history and index ko update karunga
    }
    //--P14
    dispatchBoardAction({
      // type: BOARD_ACTIONS.DRAW_UP,
      //P11
      type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
      payload: {
        actionType: TOOL_ACTION_TYPES.NONE,
      },
      //--P11
    });
  };

  //--Lect 4

  //P13
  const textAreaBlurHandler = (text, toolboxState) => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.CHANGE_TEXT,
      payload: {
        text,

        //Below elements were thought to be needed, but not needed.
        // stroke: toolboxState[boardState.activeToolItem]?.stroke,
        // size: toolboxState[boardState.activeToolItem]?.size,
        //BOARD Context ke andar baat ye thi ki stroke aur size mujhe milega kaise. Toh maine ye kiya ki jab bhi text area blur hoga, tab mai toolboxState ko as a parameter pass karunga, jisme se mai stroke and size nikal lunga, aur fir ye sab payload mei dispatch kr dunga YA fir mai toolbox ko board ke bahar kar du. So jaha se ye call hoga waha se mai toolboxState ko as a parameter pass kar dunga.
      },

      //Since maine dispath action kia hai so issi file mei reducer mei mujhe iska case banana padega
    });
  };
  //--P13

  //P14
  const boardUndoHandler = () => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.UNDO,
    });
  };
  const boardRedoHandler = () => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.REDO,
    });
  };
  //Now define reducer of these two actions in boardReducer

  //--P14

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

    //P13
    textAreaBlurHandler,
    //--P13

    //P14
    undo: boardUndoHandler,
    redo: boardRedoHandler,
    //--P14
  };

  return (
    <boardContext.Provider value={boardContextValue}>
      {children}
    </boardContext.Provider>
  );
};

export default BoardProvider;
