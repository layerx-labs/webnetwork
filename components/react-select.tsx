import Select from "react-select";
import { components } from "react-select";

 //TODO: Need to rework components to be able to use Props correctly { Props }

function ClearIndicatorWithTestId (props) {
  return(
    <div data-testId="react-select-clear-indicator">
      <components.ClearIndicator {...props} />
    </div>
  );
}
export default function ReactSelect(params: any) { // eslint-disable-line 
  return (
    <Select
      className="react-select-container"
      classNamePrefix="react-select"
      {...params}
      components={{
        ...params?.components,
        ClearIndicator: ClearIndicatorWithTestId
      }}
    />
  );
}
