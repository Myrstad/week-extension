<script lang="ts">

    import Accordion from "@/lib/components/Accordion.svelte";
    import { fade } from "svelte/transition";
    import {Settings} from "@/lib/settings.svelte";
    import {formatWeekString} from "@/lib/util/date.ts";

    const settings = new Settings();
</script>

<div class="settings" in:fade>
    <div class="accordions">
        <Accordion title="Week icon" description="Change font, behavior and color" icon="week">
            <p>Test content</p>
        </Accordion>
        <Accordion title="Click to copy" description="Change format of copied string" icon="copy">
            <div class="row copy">
                <input type="text" bind:value={settings.current.copyFormat} onchange={ (e) => settings.update("copyFormat", e.currentTarget.value) } >
                <div class="rightarrow"></div>
                <div class="output">{ formatWeekString(settings.current.copyFormat) }</div>
            </div>
            <div class="warn copy" class:visible={ !settings.current.copyFormat.includes("%") }>
                <div class="icon"></div>
                <p>No '%' included means the week number won't be shown.</p>
            </div>
        </Accordion>
        <Accordion title="Pop-Up" description="Theme and behavior" icon="theme"></Accordion>
    </div>
</div>

<style>
    .accordions {
        padding-top: 10px;
        display: flex;
        flex-direction: column;
        gap: 10px;

        .warn.copy.visible {
            display: block;
        }
        .warn.copy {
            display: none;
        }
    }
</style>