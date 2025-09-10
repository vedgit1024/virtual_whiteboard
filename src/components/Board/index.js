import { useContext, useEffect, useLayoutEffect, useRef } from "react";

//importing rough.js
import rough from "roughjs";
import boardContext from "../../store/board-context";
import { TOOL_ACTION_TYPES } from "../../constants";

function Board() {
  const canvasRef = useRef();
  //Lect3
  const {
    elements,
    boardMouseDownHandler,
    boardMouseMoveHandler,
    boardMouseUpHandler, //Part 4
    toolActionType,
  } = useContext(boardContext);
  //--Lect3

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

  //Ek new useEffect bnaya aur uper se isme jo commented out h code wo daal diya
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const roughCanvas = rough.canvas(canvas);
    const generator = roughCanvas.generator;

    const context = canvas.getContext("2d");
    context.save();

    //I will not use generator here

    // let rect1 = generator.rectangle(10, 10, 100, 100);
    // let rect2 = generator.rectangle(10, 120, 100, 100, { fill: "red" });
    // roughCanvas.draw(rect1);
    // roughCanvas.draw(rect2);

    //Karna ye hai ki elements jo draw honge, wo changes mai elements m daal dunga as a dependency so every move page refreshes
    elements.forEach((element) => {
      roughCanvas.draw(element.roughEle); //draw krne wale element ko as an object lunga
    });

    //clearning the side effect--> cleanup function lga diya, kyuki agar elements change ho to sab saaf krdo canvas fir element draw krdo
    return () => context.clearRect(0, 0, canvas.width, canvas.height);
  }, [elements]);

  const handleMouseDown = (event) => {
    // const clientX = event.clientX;
    // const clientY = event.clientY;
    // //Inn dono ki help se mujhe x,y mil jyenge ki maine click kaha kia tha board p
    // console.log(clientX, clientY);
    boardMouseDownHandler(event);
  };
  const handleMouseMove = (event) => {
    if (toolActionType === TOOL_ACTION_TYPES.DRAWING) {
      boardMouseMoveHandler(event); //ye banaunga context mei
    }
  };

  //Part 4
  const handleMouseUp = () => {
    boardMouseUpHandler();
  };
  //--Part 4

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
}

export default Board;
