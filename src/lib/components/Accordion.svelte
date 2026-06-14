<script lang="ts">
    import ChevronDown from "../../assets/icons/ChevronDown.svelte"
    import Theme from "../../assets/icons/Theme.svelte"
    import Week from "../../assets/icons/Week.svelte"
    import Copy from "../../assets/icons/Copy.svelte"

    let openedState = $state(false)

    function toggleOpened() {
        openedState = !openedState
    }

    interface Props {
        title?: string;
        description?: string;
        icon?: "default" | "week" | "copy" | "theme";
        children?: any;
    }

    let {
        title = "Title",
        description = "Description",
        icon = "default",
        children
    } : Props = $props();
</script>

<div class="accordion">
    <div class="title">
        <div class="icon">
            {#if icon == "default"}
                <ChevronDown />
            {:else if icon == "week"}
                <Week />
            {:else if icon == "copy"}
                <Copy />
            {:else if icon == "theme"}
                <Theme/>
            {/if}
        </div>
        <div class="text">
            <h2>{ title }</h2>
            <p>{ description }</p>
        </div>
        <div class="button">
            <button onclick={toggleOpened} class:active={openedState}>
                <ChevronDown />
            </button>
        </div>
    </div>
    <div class="content" class:openedState>
        <div class="inner">
            <div class="padding">
                {#if children}
                    {@render children()}
                {:else}
                    <p>No elements given to accordion.</p>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    .accordion {
        display: flex;
        flex-direction: column;
        background: var(--accordion-content-background, black);
        border-radius: 22px;


        .title {
            display: flex;
            flex-direction: row;
            gap: 4px;
            padding: 4px 8px;
            background: var(--accordion-background, black);
            border-radius: 22px;


            .icon {
                display: grid;
                place-items: center;
            }

            :global(.icon svg path) {
                fill: var(--accordion-icon, red);
            }


            .text {
                flex: 1;

                h2 {
                    margin: 0;
                    padding: 0;
                    font-size: 1rem;
                    font-weight: normal;
                }

                p {
                    margin: 0 0 2px;
                    padding: 0;
                    font-size: 12px;
                    color: var(--accordion-muted);
                }
            }

            .button {
                display: grid;
                place-items: center;
            }
            button {
                background: var(--accordion-button-background, black);
                border: none;
                border-radius: 50dvmax;
                padding: 0;
                width: 28px;
                height: 28px;
                display: grid;
                place-items: center;
                transition: transform 0.5s ease;

                &.active {
                    transform: rotate(-180deg);
                }
            }

            :global(button svg path) {
                fill: var(--accordion-button-color, red);
            }
        }

        .content {
            display: grid;
            grid-template-rows: 0fr;
            transition: grid-template-rows 0.5s ease-out;
            overflow: hidden;

            &.openedState {
                grid-template-rows: 1fr;

            }
            .inner {
                overflow: hidden;
                padding: 0 8px;

                .padding {
                    padding: 8px 0;
                }
            }
        }
    }
</style>

