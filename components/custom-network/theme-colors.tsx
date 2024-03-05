import { useEffect, useState } from "react";

import ColorInput from "components/color-input";

export default function ThemeColors({ colors, setColor }) {

  const [colorsEntries, setColorsEntries] = useState([]);

  useEffect(() => {
    setColorsEntries(colors && Object.entries(colors).map(color => ({ label: color[0], code: color[1] })) || []);
  }, [colors?.primary, colors?.oracle]);

  return (
    <>
      <div className="row border-radius-8 mb-2 gy-3">
        {
          colorsEntries.filter(color => ["primary", "oracle"].includes(color.label)).map(color =>
          <div className="col-12 col-md-4" key={color.label}>
            <ColorInput
              label={color.label}
              code={color.code}
              onChange={setColor}
            />
          </div>)
        }
      </div>
    </>
  );
}
