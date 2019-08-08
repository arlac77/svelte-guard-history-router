<script>
    export let context;

    let article;

    $: article = $context.article;
</script>

<h2 class="routetitle">ArticleHistory {article.name}</h2>
