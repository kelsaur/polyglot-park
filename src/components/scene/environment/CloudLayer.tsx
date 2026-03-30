import { Clouds } from "./Clouds";

export function CloudLayer() {
  return (
    <>
      <Clouds
        path="/models/cloud1.glb"
        position={[3, 5, -3]}
        offset={0}
        hoverSound="/audio/wind.mp3"
      />
      <Clouds
        path="/models/cloud2.glb"
        position={[-1, 7, 5]}
        offset={2}
        rotation={[0, Math.PI / 8, 0]}
      />
      <Clouds
        path="/models/cloud3.glb"
        position={[-3, 4, -3]}
        offset={3}
        rotation={[0, Math.PI / -6, 0]}
        hoverSound="/audio/wind.mp3"
      />
      <Clouds path="/models/cloud3.glb" position={[0, 9, 0]} offset={4} />
      <Clouds path="/models/cloud1.glb" position={[0, 10, 5]} offset={3.4} />
      <Clouds
        path="/models/cloud2.glb"
        position={[3, 6.6, -1]}
        offset={0.5}
        hoverSound="/audio/wind.mp3"
      />
    </>
  );
}
