<script>
  export let router;

  $: context = $router.context;
</script>

<div>
  <h3>Context</h3>

  {#if context.route !== undefined}
    <h3>Route</h3>
    Path: {context.route.path} Priority: {context.route.priority} Keys: {context.route.keys.join(' ')}
  {/if}

  <h3>Props</h3>
  <div>
    {JSON.stringify(context.params)}
  </div>

  <table>
    <thead>
      <th>Name</th>
      <th>Value</th>
      <th>Subscriptions</th>
    </thead>
    {#each [...context.keys.values()] as key}
      <tr>
        <td>{key.name}</td>
        <td>{key.value}</td>
        <td>{key.subscriptions.size}</td>
      </tr>
    {/each}
  </table>
</div>
