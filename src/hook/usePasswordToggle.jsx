import React, { useState } from "react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

const usePasswordToggle = () => {
  const [visible, setVisibility] = useState(false);

  const Icon = visible ? (
    <RemoveRedEyeIcon className="cursor-pointer bg-transparent text-blue-900" onClick={() => setVisibility(!visible)} />
  ) : (
    <VisibilityOffIcon className="cursor-pointer bg-transparent " onClick={() => setVisibility(!visible)} />
  );
  const inputType = visible ? "text" : "password";

  return [inputType, Icon];
};

export default usePasswordToggle;
