import { BrowserRouter} from "react-router-dom";
import { Footer } from "./components/Footer";
import { AppRoutes } from "./routes";
import { NavBar } from "./components/NavBar";
import "./style/styles.css";


function App() {

  return (
    <BrowserRouter>
    <NavBar />
    <AppRoutes />
    <Footer />
    </BrowserRouter>
  )
}

export default App
