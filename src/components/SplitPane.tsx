import { MouseEvent, useEffect, useRef, useState } from "react";
import styles from "./SplitPane.module.css";

export default function SplitPane({ children }: { children: JSX.Element[] }) {
  const [leftPaneFraction, setLeftPaneFraction] = useState<number | null>(null);
  const dividerPos = useRef<number | null>(null);
  const leftPaneRef = useRef<HTMLDivElement | null>(null);
  const rightPaneRef = useRef<HTMLDivElement | null>(null);
  const dividerRef = useRef<HTMLDivElement | null>(null);
  const dividerWidth = 4;

  // True or false, it doesn't matter; all that matters is that
  // its value *changes* every time the window is resized.
  const [resizeToggle, setResizeToggle] = useState(false);

  useEffect(() => {
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
    };
  });

  useEffect(() => {
    if (leftPaneRef.current && rightPaneRef.current && dividerRef.current) {
      const parentWidth = leftPaneRef.current.parentElement!.clientWidth;

      if (leftPaneFraction === null) {
        setLeftPaneFraction(0.5);
        return;
      }
      const leftPaneWidth = (parentWidth - dividerWidth) * leftPaneFraction;
      const rightPaneWidth = parentWidth - dividerWidth - leftPaneWidth;

      leftPaneRef.current.style.minWidth = leftPaneWidth + "px";
      leftPaneRef.current.style.maxWidth = leftPaneWidth + "px";
      rightPaneRef.current.style.minWidth = rightPaneWidth + "px";
      rightPaneRef.current.style.maxWidth = rightPaneWidth + "px";
      dividerRef.current.style.borderWidth = dividerWidth / 2 + "px";
    }
  }, [leftPaneFraction, resizeToggle]);

  return (
    <div style={{ display: "flex" }}>
      <div ref={leftPaneRef} className={styles.facet}>
        {children[0]}
      </div>
      <div
        ref={dividerRef}
        className={styles.divider}
        onMouseDown={onMouseDown}
      ></div>
      <div ref={rightPaneRef} className={styles.facet}>
        {children[1]}
      </div>
    </div>
  );

  function onMouseDown(e: MouseEvent) {
    dividerPos.current = e.clientX;
  }

  function onMouseUp() {
    dividerPos.current = null;
  }

  function onMouseMove(e: globalThis.MouseEvent) {
    if (!dividerPos.current) {
      return;
    }

    if (!leftPaneRef.current) {
      return;
    }

    if (leftPaneFraction) {
      const parentWidth = leftPaneRef.current.parentElement!.clientWidth;
      setLeftPaneFraction(
        leftPaneFraction + (e.clientX - dividerPos.current) / parentWidth
      );
      dividerPos.current = e.clientX;
    }
    e.preventDefault();
  }

  function onResize() {
    // Force the size computation effect to run again
    setResizeToggle(!resizeToggle);
  }
}
