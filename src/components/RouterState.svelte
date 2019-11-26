<script>
  export let router;

  let transition, state;

  $: {
    transition = $router.transition;
    state = $router.state;
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
</style>

<div>
  <h3>Router State</h3>

  {#if transition !== undefined}
    <h3>Transition</h3>
    <table>
      <tbody>
        <tr>
          <td>path</td>
          <td id="route.path">{transition.path}</td>
        </tr>
      </tbody>
    </table>
  {/if}

  {#if state.route !== undefined}
    <h3>Route</h3>
    <table>
      <tbody>
        <tr>
          <td>path</td>
          <td id="route.path">{state.route.path}</td>
        </tr>
        <tr>
          <td>priority</td>
          <td id="route.priority">{state.route.priority}</td>
        </tr>
        <tr>
          <td>keys</td>
          <td id="route.key">{state.route.keys.join(' ')}</td>
        </tr>
      </tbody>
    </table>
  {/if}

  <h3>Params</h3>
  <div>{JSON.stringify(state.params)}</div>

  <table>
    <thead>
      <th>Key</th>
      <th>Value</th>
      <th>Subscriptions</th>
    </thead>
    <tbody>
      {#each Object.values(state.keys) as key}
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
