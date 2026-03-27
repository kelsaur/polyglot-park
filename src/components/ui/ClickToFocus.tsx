import * as THREE from "three";
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export function ClickToFocus({
  controlsRef,
  cancelRef,
}: {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  cancelRef?: React.RefObject<(() => void) | null>;
}) {
  const zoomRef = useRef<number | null>(null);
  const targetRef = useRef<THREE.Vector3 | null>(null);

  //expose cancel function so Scene can call it
  useEffect(() => {
    if (cancelRef) {
      cancelRef.current = () => {
        zoomRef.current = null;
        targetRef.current = null;
      };
    }
  }, [cancelRef]);

  useFrame(() => {
    if (!controlsRef.current) return;

    //smooth zoom
    if (zoomRef.current) {
      const cam = controlsRef.current.object;
      cam.zoom += (zoomRef.current - cam.zoom) * 0.1;
      cam.updateProjectionMatrix();
      if (Math.abs(cam.zoom - zoomRef.current) < 0.1) {
        cam.zoom = zoomRef.current;
        zoomRef.current = null;
      }
    }

    //smooth pan to clicked point
    if (targetRef.current) {
      controlsRef.current.target.lerp(targetRef.current, 0.1);
      controlsRef.current.update();
      if (controlsRef.current.target.distanceTo(targetRef.current) < 0.01) {
        controlsRef.current.target.copy(targetRef.current);
        targetRef.current = null;
      }
    }
  });

  return (
    <mesh
      rotation-x={-Math.PI / 2}
      position={[0, 0, 0]}
      onDoubleClick={(e) => {
        e.stopPropagation();
        if (!controlsRef.current) return;

        //zoom in
        const cam = controlsRef.current.object;
        zoomRef.current = Math.min(cam.zoom * 1.5, 200);

        //pan to where user double clicked
        targetRef.current = new THREE.Vector3(e.point.x, 0, e.point.z);
      }}
    >
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial transparent opacity={0} />
    </mesh>
  );
}
