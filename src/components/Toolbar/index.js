import React, { useContext } from "react";
import classes from "./index.module.css";

import { useState } from "react";

//Now i will import something from classnames
//classnames is a library which conditionally give classes and more cleaner to write codes

// import from "classnames";
import cx from "classnames"; //Isse className ko wrap karte hai

import { FaSlash } from "react-icons/fa";
import { LuRectangleHorizontal } from "react-icons/lu";
import {
  FaRegCircle,
  FaArrowRight,
  FaPaintBrush,
  FaEraser,
  FaFont, //added, P13
} from "react-icons/fa";

import boardContext from "../../store/board-context";
import { TOOL_ITEMS } from "../../constants";

const Toolbar = () => {
  //I want whichever tool I click, remain active. so I will use state
  // const [activeToolItem, setActiveToolItem] = useState("LINE"); //Let initially my active toolItem is A//Naming Tools properly Now
  const { activeToolItem, changeToolHandler } = useContext(boardContext);

  return (
    <div className={classes.container}>
      <div
        className={cx(classes.toolItem, {
          [classes.active]: activeToolItem === TOOL_ITEMS.BRUSH,
        })}
        onClick={() => changeToolHandler(TOOL_ITEMS.BRUSH)}
      >
        <FaPaintBrush />
      </div>
      <div
        className={cx(classes.toolItem, {
          [classes.active]: activeToolItem === "LINE",
        })}
        onClick={() => changeToolHandler(TOOL_ITEMS.LINE)}
      >
        <FaSlash />
      </div>
      <div
        className={cx(classes.toolItem, {
          [classes.active]: activeToolItem === "RECTANGLE",
        })}
        onClick={() => changeToolHandler(TOOL_ITEMS.RECTANGLE)}
      >
        <LuRectangleHorizontal />
      </div>
      {/* Adding circle --P 6 */}
      <div
        className={cx(classes.toolItem, {
          [classes.active]: activeToolItem === "CIRCLE",
        })}
        onClick={() => changeToolHandler(TOOL_ITEMS.CIRCLE)}
      >
        <FaRegCircle />
      </div>
      {/* Adding arrow --P7*/}
      <div
        className={cx(classes.toolItem, {
          [classes.active]: activeToolItem === "ARROW",
        })}
        onClick={() => changeToolHandler(TOOL_ITEMS.ARROW)}
      >
        <FaArrowRight />
      </div>

      <div
        className={cx(classes.toolItem, {
          [classes.active]: activeToolItem === "ERASER",
        })}
        onClick={() => changeToolHandler(TOOL_ITEMS.ERASER)}
      >
        <FaEraser />
      </div>
      {/* Adding text tool */}
      <div
        className={cx(classes.toolItem, {
          [classes.active]: activeToolItem === TOOL_ITEMS.TEXT,
        })}
        onClick={() => changeToolHandler(TOOL_ITEMS.TEXT)}
      >
        <FaFont />
      </div>
    </div>
  );
};

export default Toolbar;
