import { useState } from 'react';

export function Button() {
  const [counter, setCounter] = useState(0);

  function incrementaContador() {
    setCounter(counter + 1);
  }

  return (
    <button onClick={incrementaContador}>{counter}</button>
  )
}