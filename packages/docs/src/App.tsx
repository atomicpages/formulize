import { useEffect, useRef } from "react";

import "../../formulize/style/formulize.scss";
import { UI } from "../../formulize/src/formulize";

export default function App() {
  const ref = useRef<HTMLDivElement>(null);
  const formula = useRef<UI>();

  useEffect(() => {
    if (ref.current && !formula.current) {
      formula.current = new UI(ref.current, {
        id: "formulize",
      });
    }
  }, []);

  return (
    <main>
      <button
        className="rounded-md bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 focus:bg-blue-600 focus:duration-0 transition-colors duration-200 cursor-pointer"
        onClick={() => {
          console.log(formula.current.getData());
        }}>
        Get Data
      </button>
      <div id="formulize" ref={ref} />
    </main>
  );
}
