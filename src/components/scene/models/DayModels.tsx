import { HoverMesh } from "../../helpers/HoverMesh";
import {
  Bench,
  Canoe,
  Fence,
  Flowers,
  Mushrooms,
  Stone,
  Tree,
  Path,
} from "./Models";
import { CloudLayer } from "../environment/CloudLayer";

interface DayModelsProps {
  selected: string | null;
  showCompletion: boolean;
  visited: Set<string>;
  onSelect: (word: string) => void;
}

export function DayModels({
  selected,
  showCompletion,
  visited,
  onSelect,
}: DayModelsProps) {
  return (
    <>
      {/* environment */}
      <CloudLayer />
      {/* day interactive models */}
      <HoverMesh
        word="bench"
        onSelect={onSelect}
        isVisited={visited.has("bench")}
        isAnySelected={!!selected || showCompletion}
      >
        <Bench />
      </HoverMesh>
      <HoverMesh
        word="canoe"
        onSelect={onSelect}
        isVisited={visited.has("canoe")}
        isAnySelected={!!selected || showCompletion}
      >
        <Canoe />
      </HoverMesh>
      <HoverMesh
        word="fence"
        onSelect={onSelect}
        isVisited={visited.has("fence")}
        isAnySelected={!!selected || showCompletion}
      >
        <Fence />
      </HoverMesh>
      <HoverMesh
        word="flowers"
        onSelect={onSelect}
        isVisited={visited.has("flowers")}
        isAnySelected={!!selected || showCompletion}
      >
        <Flowers />
      </HoverMesh>
      <HoverMesh
        word="mushrooms"
        onSelect={onSelect}
        isVisited={visited.has("mushrooms")}
        isAnySelected={!!selected || showCompletion}
      >
        <Mushrooms />
      </HoverMesh>
      <HoverMesh
        word="stone"
        onSelect={onSelect}
        isVisited={visited.has("stone")}
        isAnySelected={!!selected || showCompletion}
      >
        <Stone />
      </HoverMesh>
      <HoverMesh
        word="tree"
        onSelect={onSelect}
        isVisited={visited.has("tree")}
        isAnySelected={!!selected || showCompletion}
      >
        <Tree />
      </HoverMesh>
      <HoverMesh
        word="path"
        onSelect={onSelect}
        isVisited={visited.has("path")}
        isAnySelected={!!selected || showCompletion}
      >
        <Path />
      </HoverMesh>
      <CloudLayer />
    </>
  );
}
