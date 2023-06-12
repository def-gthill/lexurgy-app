import { MouseEvent, useEffect, useRef, useState } from "react";

export default function SplitPane({ children }: { children: JSX.Element[] }) {
  const [clientWidth, setClientWidth] = useState<number | null>(null);
  const dividerPos = useRef<number | null>(null);
  const leftPaneRef = useRef<HTMLDivElement | null>(null);

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
    if (leftPaneRef.current) {
      if (!clientWidth) {
        setClientWidth(leftPaneRef.current.parentElement!.clientWidth / 2);
        return;
      }

      leftPaneRef.current.style.minWidth = clientWidth + "px";
      leftPaneRef.current.style.maxWidth = clientWidth + "px";
    }
  }, [clientWidth]);

  return (
    <div style={{ display: "flex" }}>
      <div ref={leftPaneRef} className="SplitPaneFacet">
        {children[0]}
      </div>
      <div className="SplitPaneDivider" onMouseDown={onMouseDown}></div>
      <div className="SplitPaneFacet">{children[1]}</div>
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

    if (clientWidth) {
      setClientWidth(clientWidth + e.clientX - dividerPos.current);
      dividerPos.current = e.clientX;
    }
    e.preventDefault();
  }

  function onResize() {
    setClientWidth(null);
  }
}
