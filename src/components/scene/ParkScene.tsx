import { useGLTF } from "@react-three/drei";

export function ParkScene() {
  const { scene } = useGLTF("/models/parkscene2.glb");
  return <primitive object={scene} />;
}
