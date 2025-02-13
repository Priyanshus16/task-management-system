import Dashboard from "./component/Dashboard";
import AddNewTaks from "./component/AddNewTaks";
import Login from "./component/Login";
import TaskDetails from "./component/TaskDetails";
import Signup from "./component/Signup";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {

  
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/newtask" element={<AddNewTaks />} />
          <Route path="/task/:id" element={<TaskDetails />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
