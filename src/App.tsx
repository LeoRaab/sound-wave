import { Canvas } from "@react-three/fiber";
import Dots from "./components/Dots";

const App = () => {
  return (
    <Canvas orthographic camera={{ zoom: 20 }}>
      <color attach="background" args={['black']} />
      
    </Canvas>
  );
};

export default App;
