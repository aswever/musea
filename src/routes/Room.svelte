<script lang="ts">
  import "aframe";
  import "aframe-extras";
  import { getPositionForDirection, getRotationForDirection } from "./map/directions";
  import { onMount } from "svelte";
  import type { Square } from "./map/square";
  import { Direction } from "./map/types";

  export let square: Square;
  let [x, y] = [square.location.x * 16, square.location.y * 16];
  export let paintingUrl: string | undefined = undefined;

  onMount(async () => {
    const paintingRes = await fetch(`/painting`);
    const paintingJson = await paintingRes.json();
    const paintingBase64: string = paintingJson.base64;

    paintingUrl = `data:image/png;base64,${paintingBase64}`;
  });
</script>

{#if square.walls[Direction.West]}
  <a-entity
    geometry="primitive: box; width: 1; depth: 16; height: 16"
    material="color: #160626"
    position="{x - 7.5} 3 {y}"
    rotation="0 0 0"
  />
{/if}

{#if square.walls[Direction.East]}
  <a-entity
    geometry="primitive: box; width: 1; depth: 16; height: 16"
    material="color: #160626"
    position="{x + 7.5} 3 {y}"
    rotation="0 0 0"
  />
{/if}

{#if square.walls[Direction.South]}
  <a-entity
    geometry="primitive: box; width: 1; depth: 16; height: 16"
    material="color: #160626"
    position="{x} 3 {y + 7.5}"
    rotation="0 90 0"
  />
{/if}

{#if square.walls[Direction.North]}
  <a-entity
    geometry="primitive: box; width: 1; depth: 16; height: 16"
    material="color: #160626"
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
    src={paintingUrl}
    rotation={getRotationForDirection(square.painting.direction)}
  />
{/if}

<a-entity
  geometry="primitive: box; width: 1; depth: 16; height: 16"
  material="color: #224"
  position="{x} 11 {y}"
  rotation="0 0 90"
/>

<a-entity
  geometry="primitive: box; width: 1; depth: 16; height: 16"
  material="color: #bbd"
  position="{x} -5 {y}"
  rotation="0 0 90"
/>
