<script lang="ts">
    import { fade } from "svelte/transition";

    import CopyIcon from "../../../assets/icons/Copy.svelte"
    import {formatWeekString, getCurrentWeek} from "../../util/date";
    import {Settings} from "@/lib/settings.svelte";

    const settings = new Settings()

    const weekNumber = getCurrentWeek().toString();

    function copyToClipboard() {
        navigator.clipboard.writeText(formatWeekString(settings.current.copyFormat));
    }
</script>

<div class="home" in:fade>
    <h1>Current week is</h1>
    <div class="row">
        <p>{weekNumber}</p>
        <button onclick={copyToClipboard}>
            <CopyIcon></CopyIcon>
        </button>
    </div>
</div>

<style>
    .home {
        display: flex;
        width: 100%;
        align-items: center;
        flex-direction: column;
        gap: 8px;
        margin-top: 40px;

        h1 {
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 5%;
            margin: 0;
        }

        .row {
            display: flex;
            cursor: pointer;
        }

        p {
            font-size: 64px;
            font-weight: 900;
            letter-spacing: 5%;
            line-height: 71%;
            margin: 0;
        }
    }
</style>