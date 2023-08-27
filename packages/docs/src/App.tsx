import { useEffect, useRef } from "react";

import "../../formulize/style/formulize.scss";
import { UI } from "../../formulize/src/formulize";

export default function App() {
  const ref = useRef<HTMLDivElement>(null);
  const formula = useRef<UI>();

  useEffect(() => {
    if (ref.current && !formula.current) {
      formula.current = new UI(ref.current, {
        id: "formula",
      });
    }
  }, []);

  return <div id="formula" ref={ref} />;
}
