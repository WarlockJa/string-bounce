"use client";
import { useEffect, useRef } from "react";
import "./bouncystring.scss";

type TBouncyStringProps = {
  lineDelta: number;
  step: number;
};

export default function BouncyString({ lineDelta, step }: TBouncyStringProps) {
  // reference to the path
  const pathRef = useRef<SVGPathElement>(null);
  let progress: number = 0;
  let offsetX: number = 0.5;
  let time: number = 0;
  let reqId: null | number = null;

  // SVG Path
  // The d attribute contains a series of commands
  // Move To M x y takes two parameters, a coordinate (x) and coordinate (y) to move to
  // Quadratic curve Q x1 y1, x y requires one control point which determines the slope
  // of the curve at both the start point and the end point. It takes two parameters:
  // the control point and the end point of the curve.
  const setPath = (value: number) => {
    const width = window.innerWidth * 0.7;
    if (!pathRef.current) return;
    pathRef.current.setAttributeNS(
      null,
      "d",
      `M0 ${lineDelta} Q${width * offsetX} ${
        lineDelta + value
      } ${width} ${lineDelta}`
    );
  };

  // adding initial data to the svg path
  useEffect(() => {
    setPath(progress);
  }, []);

  type Tlerp = {
    start: number;
    goal: number;
    step: number;
  };
  //   linear interpolation function
  const lerp = ({ start, goal, step }: Tlerp): number => {
    return start * (1 - step) + goal * step;
  };

  // main animation function
  const animateOut = () => {
    if (Math.abs(progress) > 0.75) {
      const newProgress = progress * Math.sin(time);
      progress = lerp({ start: progress, goal: 0, step });
      time += 0.2;
      setPath(newProgress);
      reqId = requestAnimationFrame(animateOut);
    } else {
      resetAnimation();
    }
  };

  // resetting animation if a new one initiated before the curret one is finished
  const resetAnimation = () => {
    time = 0;
    progress = 0;
  };

  // managing mouse entering the svg path box
  const manageMouseEnter = () => {
    if (reqId) {
      cancelAnimationFrame(reqId);
      resetAnimation();
    }
  };

  // managing cursor movment over svg path box
  const manageMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!pathRef.current) return;
    // getting DOM element dimensions data
    const { movementY, clientX } = e;
    // getting svg path dimensions
    const pathBound = pathRef.current.getBoundingClientRect();
    // calculating mouse position relative to the svg path
    offsetX = (clientX - pathBound.left) / pathBound.width;
    progress += movementY;
    setPath(progress);
  };

  // managing mouse leave svg path box. Initiating bouncing animation
  const manageMouseLeave = () => {
    animateOut();
  };

  return (
    <div className="bouncyLine">
      <div
        onMouseEnter={() => manageMouseEnter()}
        onMouseMove={(e) => manageMouseMove(e)}
        onMouseLeave={() => manageMouseLeave()}
        className="bouncyLine--box"
      ></div>
      <svg>
        <path ref={pathRef}></path>
      </svg>
    </div>
  );
}
