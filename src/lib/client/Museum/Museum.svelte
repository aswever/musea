<script lang="ts">
  import "aframe";
  import "aframe-extras";

  import RoomComponent from "$lib/client/Room/Room.svelte";
  import type { Museum } from "$lib/shared/types";
  import type { Room } from "$lib/shared/museum/room";

  export let museum: Museum;

  const palette = museum.params.palette;
  const rooms = museum.grid.flat().filter((room) => room) as Room[];
</script>

<div>
  <a-scene physics="gravity: 0">
    <a-entity
      geometry="primitive: box; width: 1; depth: 16; height: 16"
      material="color: {palette.dark}"
      position="1 1 1"
      rotation="0 0 0"
      testId="test"
    />
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
