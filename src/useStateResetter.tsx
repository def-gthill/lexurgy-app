import { useState } from "react";

export default function useStateResetter(): [string, () => void] {
  const [toggle, setToggle] = useState(false);
  return [
    toggle.toString(),
    () => {
      setToggle(!toggle);
    },
  ];
}
