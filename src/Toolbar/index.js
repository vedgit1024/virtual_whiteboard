import React from "react";
import classes from "./index.module.css";

import { useState } from "react";

//Now i will import something from classnames
//classnames is a library which conditionally give classes and more cleaner to write codes

// import from "classnames";
import cx from "classnames"; //Isse className ko wrap karte hai

const Toolbar = () => {
  //I want whichever tool I click, remain active. so I will use state
  const [activeToolItem, setActiveToolItem] = useState("A"); //Let initially my active toolItem is A

  return (
    <div className={classes.container}>
      <div className={classes.toolItem}>A</div>
      <div className={classes.toolItem}>B</div>
    </div>
  );
};

export default Toolbar;
