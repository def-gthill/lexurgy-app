import { useEffect, useState } from "react";

export default function FeatureHider({
  getVisibleChild,
  children,
}: {
  getVisibleChild: () => Promise<number>;
  children: JSX.Element[];
}) {
  const [visibleChild, setVisibleChild] = useState(0);
  useEffect(() => {
    getVisibleChild()
      .then(setVisibleChild)
      .catch(() => {});
  }, [getVisibleChild]);
  return children[visibleChild];
}
