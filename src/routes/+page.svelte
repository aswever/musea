<script lang="ts">
  import MuseumComponent from "$lib/client/Museum/Museum.svelte";
  import { onMount } from "svelte";
  import type { Museum } from "$lib/shared/types";

  let museum: Museum;

  onMount(async () => {
    const res = await fetch("https://dreamtunnel.org/api/museum");
    museum = await res.json();
  });
</script>

<svelte:head>
  <title>dreamtunnel</title>
</svelte:head>

{#if museum}
  <MuseumComponent {museum} />
{/if}
