import { HoverMesh } from "../../helpers/HoverMesh";
import {
  Bench,
  Canoe,
  Fence,
  Flowers,
  Mushrooms,
  Stone,
  Tree,
  Frog,
  Deer,
  Owl,
  Campfire,
  Tent,
  Moon,
} from "./Models";
import { Fireflies } from "../environment/Fireflies";
import { Stars } from "../environment/Stars";

interface NightModelsProps {
  selected: string | null;
  showCompletion: boolean;
  visited: Set<string>;
  onSelect: (word: string) => void;
}

export function NightModels({
  selected,
  showCompletion,
  visited,
  onSelect,
}: NightModelsProps) {
  return (
    <>
      {/* environment */}
      <Stars count={300} />
      <Fireflies count={10} />

      {/* non-interactive day models visible at night */}
      <Bench />
      <Canoe />
      <Fence />
      <Flowers />
      <Mushrooms />
      <Stone />
      <Tree />

      {/* night interactive models */}
      <HoverMesh
        word="frog"
        onSelect={onSelect}
        isVisited={visited.has("frog")}
        isAnySelected={!!selected || showCompletion}
      >
        <Frog />
      </HoverMesh>
      <HoverMesh
        word="deer"
        onSelect={onSelect}
        isVisited={visited.has("deer")}
        isAnySelected={!!selected || showCompletion}
      >
        <Deer />
      </HoverMesh>
      <HoverMesh
        word="owl"
        onSelect={onSelect}
        isVisited={visited.has("owl")}
        isAnySelected={!!selected || showCompletion}
      >
        <Owl />
      </HoverMesh>
      <HoverMesh
        word="campfire"
        onSelect={onSelect}
        isVisited={visited.has("campfire")}
        isAnySelected={!!selected || showCompletion}
      >
        <Campfire />
      </HoverMesh>
      <HoverMesh
        word="tent"
        onSelect={onSelect}
        isVisited={visited.has("tent")}
        isAnySelected={!!selected || showCompletion}
      >
        <Tent />
      </HoverMesh>
      <HoverMesh
        word="moon"
        onSelect={onSelect}
        isVisited={visited.has("moon")}
        isAnySelected={!!selected || showCompletion}
      >
        <Moon
          position={[-3, 6.5, 1]}
          rotation={[0, -0.5, 0.5]}
          scale={[1.5, 1.5, 1.5]}
        />
      </HoverMesh>
    </>
  );
}
