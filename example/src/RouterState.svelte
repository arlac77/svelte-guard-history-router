<script>
  import { getContext } from "svelte";
  import { ROUTER } from "../../src/util.mjs";

  let router = getContext(ROUTER);
</script>

<style>
  table {
    margin-bottom: 1rem;
    color: #212529;
    border: 1px solid #dee2e6;
  }

  thead {
    vertical-align: middle;
    border-top-color: inherit;
    border-right-color: inherit;
    border-bottom-color: inherit;
    border-left-color: inherit;
  }

  tbody {
    vertical-align: middle;
    border-top-color: inherit;
    border-right-color: inherit;
    border-bottom-color: inherit;
    border-left-color: inherit;
  }

  tr {
    vertical-align: inherit;
    border-top-color: inherit;
    border-right-color: inherit;
    border-bottom-color: inherit;
    border-left-color: inherit;
  }

  th {
    text-align: inherit;
    font-weight: bold;
  }

  table thead th {
    vertical-align: bottom;
    border-bottom: 1px solid #dee2e6;
  }

  th,
  td {
    padding: 0.2rem;
    vertical-align: top;
    border-top: 1px solid #dee2e6;
  }

  .current {
    background-color: bisque;
  }

  .background {
    background-color: rgba(165, 181, 190, 0.05);
  }
</style>

<div class="background">
  <table>
    <thead>
      <th colspan="2">Transition</th>
    </thead>
    <tbody>
      {#if $router.transition !== undefined}
        <tr>
          <td id="route.path">{$router.transition.path}</td>
        </tr>
      {/if}
    </tbody>
  </table>

  <table>
    <thead>
      <th colspan="2">Routes</th>
    </thead>
    <tbody>
      {#each router.routes as r, i (i)}
        <tr class={r === $router.route ? 'current' : ''}>
          <!--         <td id="route.priority">{r.priority} </td> -->
          <td id="route.path">{r.path}</td>
          <td id="route.key">{r.keys.join(' ')}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <table>
    <thead>
      <th colspan="2">Properties</th>
    </thead>
    <tbody>
      {#each Object.entries($router.params) as e (e[0])}
        <tr>
          <td>{e[0]}</td>
          <td>{e[1]}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <table>
    <thead>
      <th>Key</th>
      <th>Value</th>
      <th>Subscriptions</th>
    </thead>
    <tbody>
      {#each Object.values($router.keys) as key}
        <tr>
          <td id="state.key.{key.name}">{key.name}</td>
          <td id="state.key.{key.name}.value">
            {key.value !== undefined ? key.value : ''}
          </td>
          <td id="state.key.{key.name}.subscriptions">
            {key.subscriptions.size}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
