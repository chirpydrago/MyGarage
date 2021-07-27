import React from "react";
import { Home } from "@material-ui/icons";
import "./App.css";
import { HomePage } from "./components/NewHomePage";
import {Switch, Route, Redirect} from "react-router-dom";

function App() {
  return (       
     
    <div className="App font-mono">
      <HomePage />
    </div>
  );
}

export default App;