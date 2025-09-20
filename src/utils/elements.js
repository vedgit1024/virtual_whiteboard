import { ARROW_LENGTH, TOOL_ITEMS } from "../constants";

import getStroke from "perfect-freehand"; //Installed perfect-freehand library first

import rough from "roughjs/bin/rough";
import { getArrowHeadsCoordinates } from "./math";

import { isPointCloseToLine } from "./math";

const gen = rough.generator();

export const createElement = (
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
    case TOOL_ITEMS.BRUSH: {
      const brushElement = {
        id,
        points: [{ x: x1, y: y1 }],
        path: new Path2D(getSvgPathFromStroke(getStroke([{ x: x1, y: y1 }]))), //Isme mai utility function use karunga Path2D is a JS function
        type,
        stroke,
      };
      return brushElement;
    }
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
    case TOOL_ITEMS.TEXT: {
      element.text = ""; //Initially click karne pe text empty hoga hoga textarea ke under
      return element;
    }
    default:
      throw new Error("Type not recognized");
  }
};

export const getSvgPathFromStroke = (stroke) => {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");
  return d.join(" ");
};

export const isPointNearElement = (element, pointX, pointY) => {
  //Harr ek element ke liye alag alag calculation karni padegi, and alag logic lagega
  // return false; ----> For testing purpose only

  //Iss function mei ye dekhna hai ki mera eraser kisi element ke kitna kareeb hai, to wo element erase ho jaye
  //So yaha pe mai har element ke liye alag alag calculation karenge.

  const { x1, y1, x2, y2, type } = element;
  switch (type) {
    case TOOL_ITEMS.LINE:
    case TOOL_ITEMS.ARROW:
      // console.log("I am here");
      return isPointCloseToLine(x1, y1, x2, y2, pointX, pointY);
    case TOOL_ITEMS.RECTANGLE:
    case TOOL_ITEMS.CIRCLE:
      return (
        isPointCloseToLine(x1, y1, x2, y1, pointX, pointY) ||
        isPointCloseToLine(x2, y1, x2, y2, pointX, pointY) ||
        isPointCloseToLine(x2, y2, x1, y2, pointX, pointY) ||
        isPointCloseToLine(x1, y2, x1, y1, pointX, pointY)
      );
    case TOOL_ITEMS.BRUSH:
      const context = document.createElement("canvas").getContext("2d");
      return context.isPointInPath(element.path, pointX, pointY);

    //P15
    case TOOL_ITEMS.TEXT: {
      const context = document.createElement("canvas").getContext("2d");
      context.font = `${element.size}px Caveat`;
      context.fillStyle = element.stroke;
      const textWidth = context.measureText(element.text).width;
      const textHeight = parseInt(element.size);
      context.restore();
      return (
        isPointCloseToLine(x1, y1, x1 + textWidth, y1, pointX, pointY) ||
        isPointCloseToLine(
          x1 + textWidth,
          y1,
          x1 + textWidth,
          y1 + textHeight,
          pointX,
          pointY
        ) ||
        isPointCloseToLine(
          x1 + textWidth,
          y1 + textHeight,
          x1,
          y1 + textHeight,
          pointX,
          pointY
        ) ||
        isPointCloseToLine(x1, y1 + textHeight, x1, y1, pointX, pointY)
      );
    }
    //--P15
    default:
      throw new Error("Type Not Recognized");
  }
};
