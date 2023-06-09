import { useEffect } from "react";
import { setCssVariables } from "../lib/setCssVariable";
import cssvariables from "../../assets/jsons/cssvariables.json";

export function useOnLoad() {
  function onLoad() {
    setCssVariables(cssvariables);
  }
  useEffect(() => {
    onLoad();
  }, []);
}
