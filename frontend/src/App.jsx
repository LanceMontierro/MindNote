import { Navbar } from "./Components";
import Hero from "./Pages/Hero";
import Feature from "./Pages/Feature";

function App() {
  return (
    <>
      <div className="bg-black text-white">
        <Navbar />
        <Hero />
        <Feature />
      </div>
    </>
  );
}

export default App;
