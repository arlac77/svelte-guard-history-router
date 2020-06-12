<script>
  export let router;

  let transition;

  $: {
    transition = $router.transition;
  }
</script>

<style>
  table {
    margin-bottom: 1rem;
    color: #212529;
    border: 1px solid #dee2e6;
  }

  thead {
    display: table-header-group;
    vertical-align: middle;
    border-top-color: inherit;
    border-right-color: inherit;
    border-bottom-color: inherit;
    border-left-color: inherit;
  }

  tbody {
    display: table-row-group;
    vertical-align: middle;
    border-top-color: inherit;
    border-right-color: inherit;
    border-bottom-color: inherit;
    border-left-color: inherit;
  }

  tr {
    display: table-row;
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
    border-bottom: 2px solid #dee2e6;
  }

  th,
  td {
    padding: 0.75rem;
    vertical-align: top;
    border-top: 1px solid #dee2e6;
  }

  .current {
    background-color: bisque;
  }
</style>

<div>
  {#if transition !== undefined}
    <table>
      <tbody>
        <tr>
          <td id="route.path">{transition.path}</td>
        </tr>
      </tbody>
    </table>
  {/if}

  <table>
    <tbody>
      {#each router.routes as r, i (i)}
        <tr class={r === $router.route ? 'current': ''}>
          <td id="route.priority">{r.priority} </td>
          <td id="route.path">{r.path}</td>
          <td id="route.key">{r.keys.join(' ')}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <h3>Params</h3>
  <div>{JSON.stringify($router.params)}</div>

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
