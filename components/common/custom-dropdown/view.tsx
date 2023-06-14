import { Dropdown } from "react-bootstrap";

export default function CustomDropdown() {
  return(
    <Dropdown className="custom-dropdown">
      <Dropdown.Toggle className="rounded-0 bg-gray-900 border-radius-4 border-gray-800 p-3">
        Dropdown Button
      </Dropdown.Toggle>

      <Dropdown.Menu variant="dark">
        <Dropdown.Item onClick={() => alert("alo")}>Action</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}