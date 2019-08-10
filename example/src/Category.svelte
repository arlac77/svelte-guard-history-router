<script>
    export let context;

    let category;

    $: category = $context.category;
</script>

<h2 class="routetitle">Category {category.name}</h2>
