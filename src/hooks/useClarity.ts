import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

const CLARITY_PROJECT_ID = "umdgbp66rq";

export function useClarity() {
  useEffect(() => Clarity.init(CLARITY_PROJECT_ID), []);
}
