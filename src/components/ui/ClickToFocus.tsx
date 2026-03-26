import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export function ClickToFocus({
  controlsRef,
}: {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}) {
  const zoomRef = useRef<number | null>(null);
  const downPos = useRef<{ x: number; y: number } | null>(null);
  const dragged = useRef(false);

  //smoothly move camera target to click point
  useFrame(() => {
    if (!zoomRef.current || !controlsRef.current) return;

    const cam = controlsRef.current.object;
    cam.zoom += (zoomRef.current - cam.zoom) * 0.05;
    cam.updateProjectionMatrix();

    if (Math.abs(cam.zoom - zoomRef.current) < 0.1) {
      cam.zoom = zoomRef.current;
      zoomRef.current = null;
    }
  });

  return (
    //invisible plane on the ground to catch clicks
    <mesh
      rotation-x={-Math.PI / 2}
      position={[0, 0, 0]}
      onPointerDown={(e) => {
        downPos.current = { x: e.clientX, y: e.clientY };
        dragged.current = false;
      }}
      onPointerMove={(e) => {
        if (!downPos.current) return;
        const dx = e.clientX - downPos.current.x;
        const dy = e.clientY - downPos.current.y;
        if (dx * dx + dy * dy > 25) dragged.current = true;
      }}
      onPointerUp={() => {
        if (dragged.current) return; //was a drag/rotate, skip zoom
        if (!controlsRef.current) return;
        const cam = controlsRef.current.object;
        zoomRef.current = Math.min(cam.zoom * 1.5, 200);
      }}
    >
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial transparent opacity={0} />
    </mesh>
  );
}
