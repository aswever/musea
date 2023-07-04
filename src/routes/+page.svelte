<script lang="ts">
  import "aframe";
  import "aframe-extras";

  import { onMount } from "svelte";
  import RoomComponent from "./Room.svelte";
  import type { Room } from "$lib/shared/museum/room";
  import type { Museum, MuseumPalette } from "$lib/shared/types";

  let rooms: Room[] = [];
  let palette: MuseumPalette;

  onMount(async () => {
    const res = await fetch("/api/museum");
    const museum: Museum = await res.json();
    palette = museum.params.palette;
    rooms = museum.grid.flat().filter((room) => room);
  });
</script>

<svelte:head>
  <title>dreamtunnel</title>
</svelte:head>

<div>
  <a-scene physics="gravity: 0">
    <a-entity position="0 0 0" id="pov">
      <a-camera
        position="0 0 0"
        movement-controls="controls: checkpoint"
        checkpoint-controls="mode: animate"
      >
        <a-entity
          cursor
          position="0 0 -1"
          geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03;"
          material="color: #CCC; shader: flat;"
        /></a-camera
      >
    </a-entity>
    <a-sky src="/sky.png" />
    {#each rooms as room}
      <RoomComponent {room} {palette} />
    {/each}
  </a-scene>
</div>
