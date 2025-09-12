import React, { useContext } from "react";

import classes from "./index.module.css";
import { COLORS } from "../../constants";
import toolboxContext from "../../store/toolbox-context";

import cx from "classnames";
import boardContext from "../../store/board-context";

const Toolbox = () => {
  const { activeToolItem } = useContext(boardContext);
  const { toolboxState, changeStroke } = useContext(toolboxContext);

  const strokeColor = toolboxState[activeToolItem]?.stroke;

  return (
    <div className={classes.container}>
      <div className={classes.selectOptionContainer}>
        <div className={classes.toolBoxLabel}>Stroke</div>
        <div className={classes.colorsContainer}>
          {Object.keys(COLORS).map((k) => {
            //Object.keys(object_name) agar karte hai then wo array return karta hai with the keys of input object_name and harr keys ka value COLORS mei daal ke le liya
            return (
              <div
                className={cx(classes.colorBox, {
                  [classes.activeColorBox]: strokeColor === COLORS[k],
                })}
                style={{ backgroundColor: COLORS[k] }}
                onClick={() => changeStroke(activeToolItem, COLORS[k])}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Toolbox;
