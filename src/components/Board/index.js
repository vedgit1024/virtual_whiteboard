import { useContext, useEffect, useLayoutEffect, useRef } from "react";

//importing rough.js
import rough from "roughjs";
import boardContext from "../../store/board-context";
import { TOOL_ACTION_TYPES, TOOL_ITEMS } from "../../constants";
import toolboxContext from "../../store/toolbox-context";

import classes from "./index.module.css";

function Board() {
  const canvasRef = useRef();

  //P13
  const textAreaRef = useRef();
  //--P13

  //Lect3
  const {
    elements,
    boardMouseDownHandler,
    boardMouseMoveHandler,
    boardMouseUpHandler, //Part 4
    toolActionType,
    //P13
    //boardContext se textAreaBlurHandler ko le aaya
    textAreaBlurHandler,
    //P--13

    //P16
    undo,
    redo,
    //-P16
  } = useContext(boardContext);
  //--Lect3

  //P9
  //To handle toolbox state, directly as a parameter pass kar denge and handle kar lenge
  const { toolboxState } = useContext(toolboxContext);
  //--P9

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    //canvas pe jab bhi draw kare, ek context hona chahiye uske sath so,
    // const context = canvas.getContext("2d");

    //using roughjs
    // const roughCanvas = rough.canvas(canvas);
    // const generator = roughCanvas.generator;
    // //Now generator bnane ke baad mai koi bhi shapes bana sakta hu
    // //Let's see
    // let rect1 = generator.rectangle(10, 10, 100, 100);
    // let rect2 = generator.rectangle(10, 120, 100, 100, { fill: "red" });
    // roughCanvas.draw(rect1);
    // roughCanvas.draw(rect2);

    // context.fillStyle = "#FF0000"; -->Was just to visualise shape using canvas, so commented later
    // context.fillRect(0, 0, 150, 75);
  }, []);

  //P16
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.ctrlKey && event.key === "z") {
        undo();
      } else if (event.ctrlKey && event.key === "y") {
        redo();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    //cleanup function
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    //Jab mai unmount karunga dom mei se to mujhe hmesha event listener ko remove karna padega, otherwise unexpected behaviours are possible
  }, [undo, redo]);
  //--P16

  //Ek new useEffect bnaya aur uper se isme jo commented out h code wo daal diya
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const roughCanvas = rough.canvas(canvas);
    // const generator = roughCanvas.generator;

    const context = canvas.getContext("2d");
    context.save();

    //I will not use generator here

    // let rect1 = generator.rectangle(10, 10, 100, 100);
    // let rect2 = generator.rectangle(10, 120, 100, 100, { fill: "red" });
    // roughCanvas.draw(rect1);
    // roughCanvas.draw(rect2);

    //Karna ye hai ki elements jo draw honge, wo changes mai elements m daal dunga as a dependency so every move page refreshes
    // elements.forEach((element) => {
    //   roughCanvas.draw(element.roughEle); //draw krne wale element ko as an object lunga
    // });
    //Like above we drew using rough library, we can't use it for brush continuous draw functionality.

    //P10
    elements.forEach((element) => {
      switch (element.type) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.CIRCLE:
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.ARROW:
          roughCanvas.draw(element.roughEle); //draw krne wale element ko as an object lunga
          break;
        case TOOL_ITEMS.BRUSH: {
          // context.fillStyle = element.stroke; //kyuki waha se mere paas element mei stroke ayega
          // //then call context.fill

          // context.lineWidth = element.size || 2; // smaller = thinner brush
          // // context.fill(element.path);
          // context.stroke(element.path);
          // context.restore();
          // break;
          context.strokeStyle = element.stroke;
          context.lineWidth = element.size || 2;
          context.lineJoin = "round"; // smooth joints
          context.lineCap = "round"; // smooth line ends

          context.beginPath();
          context.moveTo(element.points[0].x, element.points[0].y);
          element.points.forEach((p) => context.lineTo(p.x, p.y));
          context.stroke();
          context.restore();
          break;
        }
        case TOOL_ITEMS.TEXT: {
          context.textBaseline = "top";
          context.font = `${element.size}px Caveat`;
          context.fillStyle = element.stroke;
          context.fillText(element.text, element.x1, element.y1);
          context.restore();
          break;
        }
        default:
          throw new Error("Type Not Recognized");
      }
    });
    //--P10

    //clearning the side effect--> cleanup function lga diya, kyuki agar elements change ho to sab saaf krdo canvas fir element draw krdo
    return () => context.clearRect(0, 0, canvas.width, canvas.height);
  }, [elements]);

  //P13
  useEffect(() => {
    const textArea = textAreaRef.current;
    if (toolActionType === TOOL_ACTION_TYPES.WRITING) {
      setTimeout(() => {
        textArea.focus(); //To focus on text area as soon as it appears
      }, 0);
    }
  }, [toolActionType]);
  //--P13

  const handleMouseDown = (event) => {
    // const clientX = event.clientX;
    // const clientY = event.clientY;
    // //Inn dono ki help se mujhe x,y mil jyenge ki maine click kaha kia tha board p
    // console.log(clientX, clientY);
    boardMouseDownHandler(event, toolboxState);
  };
  const handleMouseMove = (event) => {
    // if (toolActionType === TOOL_ACTION_TYPES.DRAWING) {
    boardMouseMoveHandler(event); //ye banaunga context mei
    // }
  };

  //Part 4
  const handleMouseUp = () => {
    boardMouseUpHandler();
  };
  //--Part 4

  ////////
  /// ADDING TOUCH SUPPORT FEATURE & WRITING PAD FEATURE -- OPTIMIZATIONs for better User Exoerience
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const touchToMouse = (touchEvent) => {
      const touch = touchEvent.touches[0] || touchEvent.changedTouches[0];
      return {
        clientX: touch.clientX,
        clientY: touch.clientY,
      };
    };

    const handleTouchStart = (e) => {
      e.preventDefault();
      handleMouseDown(touchToMouse(e));
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      handleMouseMove(touchToMouse(e));
    };

    const handleTouchEnd = (e) => {
      e.preventDefault();
      handleMouseUp(touchToMouse(e));
    };

    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp]);

  ///////
  return (
    <>
      {toolActionType === TOOL_ACTION_TYPES.WRITING && (
        <textarea
          type="text"
          ref={textAreaRef}
          className={classes.textElementBox}
          style={{
            top: elements[elements.length - 1].y1,
            left: elements[elements.length - 1].x1,
            fontSize: `${elements[elements.length - 1]?.size}px`,
            color: elements[elements.length - 1]?.stroke,
          }}
          onBlur={
            (event) => textAreaBlurHandler(event.target.value)
            //Yaha pe tooboxState uper aa hi rahi hai, toolbox context se, so yaha pe as a parameter pass kar denge so that mujhe stroke and size mil jaye BoardProvider mei.
          }
        />
      )}
      <canvas
        ref={canvasRef}
        id="canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </>
  );
}

export default Board;
