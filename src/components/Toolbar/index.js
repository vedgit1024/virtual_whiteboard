import React, { useContext } from "react";
import classes from "./index.module.css";

import { useState } from "react";

//Now i will import something from classnames
//classnames is a library which conditionally give classes and more cleaner to write codes

// import from "classnames";
import cx from "classnames"; //Isse className ko wrap karte hai

import { FaSlash } from "react-icons/fa";
import { LuRectangleHorizontal } from "react-icons/lu";
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
    </div>
  );
};

export default Toolbar;
