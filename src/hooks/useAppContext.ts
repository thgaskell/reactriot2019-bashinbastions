import React from "react";
import { CLI } from "../index";

export const AppContext = React.createContext<CLI>({} as any);

export const useAppContext = () => React.useContext(AppContext);
