import { useEffect, useRef } from "react";

//importing rough.js
import rough from "roughjs";

function Board() {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    //canvas pe jab bhi draw kare, ek context hona chahiye uske sath so,
    const context = canvas.getContext("2d");

    //using roughjs
    const roughCanvas = rough.canvas(canvas);
    const generator = roughCanvas.generator;
    //Now generator bnane ke baad mai koi bhi shapes bana sakta hu
    //Let's see
    let rect1 = generator.rectangle(10, 10, 100, 100);
    let rect2 = generator.rectangle(10, 120, 100, 100, { fill: "red" });
    roughCanvas.draw(rect1);
    roughCanvas.draw(rect2);

    // context.fillStyle = "#FF0000"; -->Was just to visualise shape using canvas, so commented later
    // context.fillRect(0, 0, 150, 75);
  }, []);

  return <canvas ref={canvasRef} />;
}

export default Board;
