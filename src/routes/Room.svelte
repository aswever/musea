<script lang="ts">
  import "aframe";
  import "aframe-extras";
  import {
    Direction,
    getPositionForDirection,
    getRotationForDirection,
  } from "$lib/shared/museum/directions";
  import type { Room } from "$lib/shared/museum/room";
  import type { MuseumPalette } from "$lib/shared/types";

  export let room: Room;
  export let palette: MuseumPalette;
  let [x, y] = [room.location.x * 16, room.location.y * 16];
</script>

{#if room.walls[Direction.West]}
  <a-entity
    geometry="primitive: box; width: 1; depth: 16; height: 16"
    material="color: {palette.dark}"
    position="{x - 7.5} 3 {y}"
    rotation="0 0 0"
  />
{/if}

{#if room.walls[Direction.East]}
  <a-entity
    geometry="primitive: box; width: 1; depth: 16; height: 16"
    material="color: {palette.dark}"
    position="{x + 7.5} 3 {y}"
    rotation="0 0 0"
  />
{/if}

{#if room.walls[Direction.South]}
  <a-entity
    geometry="primitive: box; width: 1; depth: 16; height: 16"
    material="color: {palette.dark}"
    position="{x} 3 {y + 7.5}"
    rotation="0 90 0"
  />
{/if}

{#if room.walls[Direction.North]}
  <a-entity
    geometry="primitive: box; width: 1; depth: 16; height: 16"
    material="color: {palette.dark}"
    position="{x} 3 {y - 7.5}"
    rotation="0 90 0"
  />
{/if}

{#if room.painting}
  <a-entity
    geometry="primitive: box; width: 6.5; depth: 0.2; height: 6.5"
    material="color: #111"
    position={getPositionForDirection({ x, y }, room.painting.direction)}
    rotation={getRotationForDirection(room.painting.direction)}
  />

  <a-image
    width="6"
    height="6"
    position={getPositionForDirection({ x, y }, room.painting.direction, true)}
    src={room.painting.imageUrl}
    rotation={getRotationForDirection(room.painting.direction)}
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
  checkpoint
/>
