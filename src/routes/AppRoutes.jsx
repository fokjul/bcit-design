import { Routes, Route } from "react-router-dom";

import Home from "../utilPages/Home";
import CoursePage from "../prototypes/coursePage/CoursePage";
import CartPage from "../prototypes/CartPage/CartPage";
import NotFound from "../utilPages/NotFound";
import Prototypes from "../utilPages/Prototypes";

const AppRoutes = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/prototypes" element={<Prototypes />} />
      <Route exact path="/prototypes/course" element={<CoursePage />} />
      <Route exact path="/prototypes/cart" element={<CartPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;