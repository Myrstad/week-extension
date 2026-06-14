<script lang="ts">
    import {getCurrentTab, setCurrentTab} from "@/lib/components/tab/TabState.svelte";
</script>

<div class="container">
    <div class="tab-switcher">
        <button class:active={getCurrentTab() == "home"} onclick={() => setCurrentTab("home")}>Home</button>
        <button class:active={getCurrentTab() == "settings"} onclick={() => setCurrentTab("settings")}>Settings</button>
    </div>
</div>

<style>
    .container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
    }

    .tab-switcher {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border-radius: 50vmax;
        border: 1px solid var(--text-color);
        overflow: hidden;

        button {
            border: none;
            background: none;
            padding: 0.5rem;
            font-size: 12px;
            color: var(--text-color);

            &.active {
                background-color: var(--container-color);
                font-weight: 500;
            }
        }
        :nth-child(1) {
            padding-left: 1.25rem;
            padding-right: 0.75rem;
            border-right: 1px solid var(--text-color);
        }
        :nth-child(2) {
            padding-left: 0.75rem;
            padding-right: 1.25rem;
        }
    }

</style>