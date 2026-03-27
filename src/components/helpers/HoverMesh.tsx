import * as THREE from "three";
import { useState, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";

export function HoverMesh({
  children,
  hitPadding = 0.01,
  word,
  onSelect,
  isVisited = false,
  isAnySelected = false,
}: {
  children: React.ReactNode;
  hitPadding?: number;
  word: string;
  onSelect: (word: string) => void;
  isVisited?: boolean;
  isAnySelected?: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const hitRef = useRef<THREE.Mesh>(null);
  const initialized = useRef(false);
  const [hovered, setHovered] = useState(false);
  const [meshTop, setMeshTop] = useState<THREE.Vector3>(
    new THREE.Vector3(0, 4, 0),
  );

  //resize hitbox + calculate mesh top for checkmark
  useEffect(() => {
    if (!ref.current || !hitRef.current) return;
    const box = new THREE.Box3().setFromObject(ref.current);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    //hitbox
    hitRef.current.scale.set(
      size.x + hitPadding,
      size.y + hitPadding,
      size.z + hitPadding,
    );
    hitRef.current.position.copy(center);

    //checkmark position: top of mesh center + 1 unit above
    setMeshTop(new THREE.Vector3(center.x, box.max.y + 1, center.z));
  }, [hitPadding]);

  //cursor pointer
  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered]);

  //smooth scale + emissive
  useFrame(() => {
    if (!ref.current) return;

    //on first frame, immediately zero out emissive to prevent flash on load
    if (!initialized.current) {
      ref.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.emissive = new THREE.Color("#ffffff");
          child.material.emissiveIntensity = 0;
        }
      });
      initialized.current = true;
      return;
    }

    const targetScale = hovered ? 1.1 : 1.0;
    ref.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.05,
    );

    ref.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const targetIntensity = hovered ? 0.1 : 0;
        child.material.emissive = new THREE.Color("#ffffff");
        child.material.emissiveIntensity +=
          (targetIntensity - child.material.emissiveIntensity) * 0.1;
      }
    });
  });

  return (
    <group>
      {/* checkmark above mesh, only when visited */}
      {isVisited && !isAnySelected && (
        <Html
          position={[meshTop.x, meshTop.y, meshTop.z]}
          center
          transform
          sprite
        >
          <div className="checkmark">✓</div>
        </Html>
      )}

      {/* invisible hitbox */}
      <mesh
        ref={hitRef}
        visible={false}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerUp={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(word);
        }}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* actual model */}
      <group ref={ref}>{children}</group>
    </group>
  );
}
