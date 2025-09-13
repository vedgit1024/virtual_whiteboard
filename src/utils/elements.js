import { ARROW_LENGTH, TOOL_ITEMS } from "../constants";

import rough from "roughjs/bin/rough";
import { getArrowHeadsCoordinates } from "./math";

const gen = rough.generator();

export const createRoughElement = (
  id,
  x1,
  y1,
  x2,
  y2,
  { type, stroke, fill, size }
) => {
  const element = {
    id,
    x1,
    y1,
    x2,
    y2,
    //P9
    type,
    stroke,
    fill,
    size,
    //--P9
  };

  //Whenever i am drawing a shape, the handwritten style is changing with every rendering, to stop this
  let options = {
    seed: id + 1, //seed can't be 0
    fillStyle: "solid",
  };
  //P9
  //Now stroke aur fill yaha tak pahuch chuke hai, after doing all necessary codes
  if (stroke) {
    options.stroke = stroke;
  }
  if (fill) {
    options.fill = fill;
  }
  if (size) {
    options.strokeWidth = size;
  }
  //ye options mei pass ho ja rhe h tool components mei jo aage jaake mai generator ko de de rha hu
  //P--9

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
    case TOOL_ITEMS.CIRCLE: {
      const centreX = (x1 + x2) / 2;
      const centreY = (y1 + y2) / 2;
      const width = x2 - x1;
      const height = y2 - y1;
      //ellipse ka centre find kia initial x1,y1 and final x2,y2 coordinates se and width and height, same rect ki dedi
      element.roughEle = gen.ellipse(centreX, centreY, width, height, options);
      return element;
    }
    case TOOL_ITEMS.ARROW: {
      const { x3, y3, x4, y4 } = getArrowHeadsCoordinates(
        x1,
        y1,
        x2,
        y2,
        ARROW_LENGTH
      );
      //To create an array, we have to move continuosly without breaking the pen flow, that is,
      //start from (x1,y1)-->(x2,y2)-->(x3,y3)-->(x2,y2)-->(x4,y4)
      const points = [
        [x1, y1],
        [x2, y2],
        [x3, y3],
        [x2, y2],
        [x4, y4],
      ];
      //Now constructing the arrow using gen.linearPath
      element.roughEle = gen.linearPath(points, options);
      return element;
    }
    default:
      throw new Error("Tool not recognized");
  }
};
