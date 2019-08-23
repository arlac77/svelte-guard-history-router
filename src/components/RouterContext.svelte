<script>
  export let router;

  $: context = $router.context;
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

  th, td {
    padding: 0.75rem;
    vertical-align: top;
    border-top: 1px solid #dee2e6;
  }
</style>

<div>
  <h3>Context</h3>

  {#if context.route !== undefined}
    <h3>Route</h3>
    <table>
      <tbody>
        <tr>
          <td>path</td>
          <td id="route.path">{context.route.path}</td>
        </tr>
        <tr>
          <td>priority</td>
          <td id="route.priority">{context.route.priority}</td>
        </tr>
        <tr>
          <td>keys</td>
          <td id="route.key">{context.route.keys.join(' ')}</td>
        </tr>
      </tbody>
    </table>
  {/if}

  <h3>Props</h3>
  <div>{JSON.stringify(context.params)}</div>

  <table>
    <thead>
      <th>Key</th>
      <th>Value</th>
      <th>Subscriptions</th>
    </thead>
    <tbody>
      {#each Object.values(context.keys) as key}
        <tr>
          <td id="context.key.{key.name}">{key.name}</td>
          <td id="context.key.{key.name}.value">{key.value}</td>
          <td id="context.key.{key.name}.subscriptions">
            {key.subscriptions.size}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
