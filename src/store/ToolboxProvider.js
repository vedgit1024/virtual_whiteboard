import React, { useReducer } from "react";
import toolboxContext from "./toolbox-context";
import { COLORS, TOOL_ITEMS, TOOLBOX_ACTIONS } from "../constants";

function toolboxReducer(state, action) {
  switch (action.type) {
    case "CHANGE_STROKE": {
      const newState = { ...state }; //copied initial state
      newState[action.payload.tool].stroke = action.payload.stroke;
      return newState;
    }
    case TOOLBOX_ACTIONS.CHANGE_FILL: {
      const newState = { ...state };
      newState[action.payload.tool].fill = action.payload.fill;
      return newState;
    }
    case TOOLBOX_ACTIONS.CHANGE_SIZE: {
      const newState = { ...state };
      newState[action.payload.tool].size = action.payload.size;
      return newState;
    }
    default:
      return state;
  }
}

const initialToolboxState = {
  //isme harr tool ka initial state banata hu
  [TOOL_ITEMS.LINE]: {
    stroke: COLORS.BLACK,
    size: 1,
    //colors ko constants.js mei define kia hai
    //And line tool mei fill option ka koi meaning nahi h
  },
  [TOOL_ITEMS.RECTANGLE]: {
    stroke: COLORS.BLACK,
    fill: null, //initially
    size: 1, //stroke size
  },
  [TOOL_ITEMS.CIRCLE]: {
    stroke: COLORS.BLACK,
    fill: null, //initially
    size: 1, //stroke size
  },
  [TOOL_ITEMS.ARROW]: {
    stroke: COLORS.BLACK,
    size: 1, //stroke size
  },
  [TOOL_ITEMS.BRUSH]: {
    stroke: COLORS.BLACK,
    size: 1, //stroke size
  },
};
//Isko provider mei as value mei provide bhi karna padega

const ToolboxProvider = ({ children }) => {
  const [toolboxState, dispatchToolboxAction] = useReducer(
    toolboxReducer,
    initialToolboxState
  );

  const changeStrokeHandler = (tool, stroke) => {
    dispatchToolboxAction({
      type: "CHANGE_STROKE",
      payload: {
        tool,
        stroke,
      },
    });
  };

  const changeFillHandler = (tool, fill) => {
    dispatchToolboxAction({
      type: "CHANGE_FILL",
      payload: {
        tool,
        fill,
      },
    });
  };

  const changeSizeHandler = (tool, size) => {
    dispatchToolboxAction({
      type: TOOLBOX_ACTIONS.CHANGE_SIZE,
      payload: {
        tool,
        size,
      },
    });
  };

  const toolboxContextValue = {
    //alag se ye ek hi bana dena sahi rahta hai value ke liye
    toolboxState,
    changeStroke: changeStrokeHandler,
    changeFill: changeFillHandler,
    changeSize: changeSizeHandler,
  };
  //Now go to app.js and iss provider ko use krna hai
  return (
    <toolboxContext.Provider value={toolboxContextValue}>
      {children}
    </toolboxContext.Provider>
  );
};

export default ToolboxProvider;
