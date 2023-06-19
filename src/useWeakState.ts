import { useEffect, useState } from "react";

/**
 * Creates a state variable that can be taken over
 * at will by the parent. This allows a component to
 * maintain its state internally OR delegate to the parent,
 * depending on the parent's needs.
 *
 * @param state The state value passed in from the parent
 * @param setState the state setter callback passed in from the parent
 * @returns A getter/setter pair for the state variable.
 */
export default function useWeakState<T>(
  state: T,
  setState: (newState: T) => void
): [T, (newState: T) => void] {
  const [myState, setMyState] = useState(state);

  useEffect(() => {
    // If the parent triggers a rerender by passing
    // in a new state value, overwrite the local state
    // variable with this value too.
    setMyState(state);
  }, [state]);

  function mySetState(newState: T) {
    // Change the local state variable AND notify the
    // parent that the state has changed.
    setMyState(newState);
    setState(newState);
  }

  return [myState, mySetState];
}
