import { TOOL_ITEMS } from "../constants";

import rough from "roughjs/bin/rough";

const gen = rough.generator();

export const createRoughElement = (id, x1, y1, x2, y2, { type }) => {
  const element = {
    id,
    x1,
    y1,
    x2,
    y2,
  };

  //Whenever i am drawing a shape, the handwritten style is changing with every rendering, to stop this
  let options = {
    seed: id + 1, //seed can't be 0
  };

  //Handling element object created above using switch case
  switch (type) {
    case TOOL_ITEMS.LINE: {
      element.roughEle = gen.line(x1, y1, x2, y2, options);
      return element;
    }
    case TOOL_ITEMS.RECTANGLE: {
      element.roughEle = gen.rectangle(x1, y1, x2 - x1, y2 - y1, options);
      return element;
    }
    default:
      throw new Error("Tool not recognized");
  }
};
