"use client";
import { useEffect, useRef, useState } from "react";
import "./bouncystring.scss";

type TBouncyStringProps = {
  lineDelta: number;
  defaultTime: number;
};

type TBouncyStringState = {
  progress: number;
  offsetX: number;
  time: number;
  reqId: number | null;
};

export default function BouncyString({
  lineDelta,
  defaultTime,
}: TBouncyStringProps) {
  // reference to the string
  const pathRef = useRef<SVGPathElement>(null);
  // animation state data
  // const [bounceData, setBounceData] = useState<TBouncyStringState>({
  //   progress: 0,
  //   offsetX: 0.5,
  //   time: defaultTime,
  //   reqId: null,
  // });
  let progress: number = 0;
  let offsetX: number = 0.5;
  let time: number = defaultTime;
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
    // pathRef.current.setAttributeNS(
    //   null,
    //   "d",
    //   `M0 ${lineDelta} Q${width * bounceData.offsetX} ${
    //     lineDelta + value
    //   } ${width} ${lineDelta}`
    // );
  };

  // adding initial data to the svg path
  useEffect(() => {
    // setPath(bounceData.progress);
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
  //   TEST if soemthing doesn't work it's here
  const animateOut = () => {
    // const newProgress = bounceData.progress * Math.sin(bounceData.time);
    const newProgress = progress * Math.sin(time);
    progress = lerp({ start: progress, goal: 0, step: 0.025 });
    time += 0.2;
    // setBounceData((bounceData) => ({
    //   ...bounceData,
    //   progress: lerp({ start: bounceData.progress, goal: 0, step: 0.025 }),
    //   time: bounceData.time + 0.2,
    // }));
    setPath(newProgress);
    // if (Math.abs(bounceData.progress) > 0.75) {
    if (Math.abs(progress) > 0.75) {
      reqId = requestAnimationFrame(animateOut);
      // setBounceData((bounceData) => ({
      //   ...bounceData,
      //   reqId: requestAnimationFrame(animateOut),
      // }));
    } else {
      resetAnimation();
    }
  };

  // resetting animation if a new one initiated before the curret one is finished
  const resetAnimation = () => {
    time = defaultTime;
    progress = 0;
    // setBounceData((bounceData) => ({
    //   ...bounceData,
    //   time: defaultTime,
    //   progress: 0,
    // }));
  };

  // managing mouse entering the svg path box
  const manageMouseEnter = () => {
    // if (bounceData.reqId) {
    //   cancelAnimationFrame(bounceData.reqId);
    //   resetAnimation();
    // }
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
    // const x = (clientX - pathBound.left) / pathBound.width;
    offsetX = (clientX - pathBound.left) / pathBound.width;
    // const progress = bounceData.progress + movementY;
    progress += movementY;
    // saving offset data to state and incrementing progress
    // setBounceData((bounceData) => ({
    //   ...bounceData,
    //   progress: progress,
    //   offsetX: x,
    // }));
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
