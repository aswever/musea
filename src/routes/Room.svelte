<script lang="ts">
  import "aframe";
  import "aframe-extras";
  import { getPositionForDirection, getRotationForDirection } from "./api/map/directions";
  import type { Square } from "./api/map/square";
  import { Direction } from "./api/map/types";
  import type { Palette } from "./api/map/museum";

  export let square: Square;
  export let palette: Palette;
  let [x, y] = [square.location.x * 16, square.location.y * 16];
</script>

{#if square.walls[Direction.West]}
  <a-entity
    geometry="primitive: box; width: 1; depth: 16; height: 16"
    material="color: {palette.dark}"
    position="{x - 7.5} 3 {y}"
    rotation="0 0 0"
  />
{/if}

{#if square.walls[Direction.East]}
  <a-entity
    geometry="primitive: box; width: 1; depth: 16; height: 16"
    material="color: {palette.dark}"
    position="{x + 7.5} 3 {y}"
    rotation="0 0 0"
  />
{/if}

{#if square.walls[Direction.South]}
  <a-entity
    geometry="primitive: box; width: 1; depth: 16; height: 16"
    material="color: {palette.dark}"
    position="{x} 3 {y + 7.5}"
    rotation="0 90 0"
  />
{/if}

{#if square.walls[Direction.North]}
  <a-entity
    geometry="primitive: box; width: 1; depth: 16; height: 16"
    material="color: {palette.dark}"
    position="{x} 3 {y - 7.5}"
    rotation="0 90 0"
  />
{/if}

{#if square.painting}
  <a-entity
    geometry="primitive: box; width: 6.5; depth: 0.2; height: 6.5"
    material="color: #111"
    position={getPositionForDirection({ x, y }, square.painting.direction)}
    rotation={getRotationForDirection(square.painting.direction)}
  />

  <a-image
    width="6"
    height="6"
    position={getPositionForDirection({ x, y }, square.painting.direction, true)}
    src={square.painting.imageUrl}
    rotation={getRotationForDirection(square.painting.direction)}
  />
{/if}

<a-entity
  geometry="primitive: box; width: 1; depth: 16; height: 16"
  material="color: {palette.medium}"
  position="{x} 11 {y}"
  rotation="0 0 90"
/>

<a-entity
  geometry="primitive: box; width: 1; depth: 16; height: 16"
  material="color: {palette.light}"
  position="{x} -5 {y}"
  rotation="0 0 90"
/>
