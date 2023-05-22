import { useState } from "react";

import HamburgerIcon from "assets/icons/hamburger-icon";

import Button from "components/button";
import MenuDrawer from "components/mobile-menu/menu-drawer";

export default function MobileMenu() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return(
    <>
      <Button
        className="p-0 not-svg"
        transparent
        onClick={handleShow}
      >
        <HamburgerIcon />
      </Button>

      <MenuDrawer
        show={show}
        onHide={handleClose}
      />
    </>
  );
}