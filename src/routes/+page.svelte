<script lang="ts">
  import "aframe";
  import "aframe-extras";

  import { onMount } from "svelte";
  import Room from "./Room.svelte";
  import type { Square } from "./map/square";

  let squares: Square[] = [];

  onMount(async () => {
    const res = await fetch("/map");
    squares = await res.json();
  });
</script>

<svelte:head>
  <title>dreamtunnel</title>
</svelte:head>

<div>
  <a-scene physics="gravity: 0">
    <a-entity track-position movement-controls="constrainToNavMesh: true; speed: 0.6">
      <a-entity camera look-controls kinematic-body collider>
        <a-entity
          cursor
          position="0 0 -1"
          geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03"
          material="color: black; shader: flat"
        />
      </a-entity>
    </a-entity>
    <a-sky src="/sky.png" />
    {#each squares as square}
      <Room {square} />
    {/each}
  </a-scene>
</div>
