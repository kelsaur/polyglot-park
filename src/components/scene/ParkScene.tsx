import { useGLTF } from "@react-three/drei";

export function ParkScene() {
  const { scene } = useGLTF("/models/parkscene.glb");
  return <primitive object={scene} />;
}
