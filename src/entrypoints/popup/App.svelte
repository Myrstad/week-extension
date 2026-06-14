<script lang="ts">
  import {applyTheme, argbFromHex, themeFromSourceColor} from "@material/material-color-utilities";
  import HomeTab from "@/lib/components/tab/HomeTab.svelte";
  import SettingsTab from "@/lib/components/tab/SettingsTab.svelte";
  import TabSwitcher from "@/lib/components/tab/TabSwitcher.svelte";
  import {getCurrentTab} from "@/lib/components/tab/TabState.svelte";
  import {Settings} from "@/lib/settings.svelte";
  import {formatWeekString} from "@/lib/util/date";

  const source = argbFromHex("#af00ef")
  const theme = themeFromSourceColor(source)

  const settings = new Settings()
  settings.update("seedColor", "blue")
  console.log($state.snapshot(settings.current))
  console.log(formatWeekString(settings.current.copyFormat))
  console.log(formatWeekString("% is the week, since % is the week"))

  applyTheme(theme, {
    target: document.documentElement,
    dark: true
  })

</script>

<main>
  <TabSwitcher></TabSwitcher>
  {#if getCurrentTab() == "home"}
    <HomeTab></HomeTab>
  {:else if getCurrentTab() == "settings"}
    <SettingsTab></SettingsTab>
  {/if}
</main>

<style>
  :global {
    html, body, .app, main {
      background: var(--background);
      color: var(--text-color);
    }
  }
</style>
