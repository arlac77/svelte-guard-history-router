<script>
  import { Route, MasterRoute, DetailRoute } from "../../../src/index.svelte";
  import Articles from "./Articles.svelte";
  import Article from "./Article.svelte";
  import ArticleLink from "./ArticleLink.svelte";

  let { source, guard } = $props();
</script>

<Route
  path="/article"
  factory={MasterRoute}
  iteratorFor={source}
  {guard}
  component={Articles}
>
  <slot />
  <Route
    path="/:article"
    factory={DetailRoute}
    propertyMapping={{ article: "id" }}
    linkComponent={ArticleLink}
    component={Article}
  />
</Route>
