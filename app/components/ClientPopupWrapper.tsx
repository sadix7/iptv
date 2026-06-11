"use client";

import WorldCupPopup from "./WorldCupPopup";

interface ClientPopupWrapperProps {
  showPopup: boolean;
  disableWcPopup: boolean;
  disableTgPopup: boolean;
}

export default function ClientPopupWrapper({
  showPopup,
  disableWcPopup,
}: ClientPopupWrapperProps) {
  if (!showPopup) return null;

  return (
    <>
      {!disableWcPopup && <WorldCupPopup showPopup={showPopup} />}
    </>
  );
}
