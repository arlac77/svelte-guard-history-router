<script>
    export let context;

    let article;

    context.subscribe(c => article = c.article);
</script>

<h2 class="routetitle">Article {article.name}</h2>
