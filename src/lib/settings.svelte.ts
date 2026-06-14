import {ExtensionSettings} from "@/lib/types";
import { storage } from '#imports';

const defaultSettings: ExtensionSettings = {
    accentStyle: "grayscale",
    copyFormat: "Week %",
    iconColorMode: "auto",
    iconCustomColor: "#ff0000",
    iconFont: 1,
    themeMode: "auto",
    seedColor: "#0000ff"
}

export class Settings {
    #settings = $state({...defaultSettings}) as ExtensionSettings;
    isLoading = $state(true);
    isSaving = $state(false);

    constructor() {
        this.init().catch(console.error);
    }

    private async init(): Promise<void> {
        const keys = Object.keys(defaultSettings) as Array<keyof ExtensionSettings>;
        const promises = keys.map(async (key) => {
            const storageKey = `local:${key}`;
            const storedValue = await storage.getItem(<StorageItemKey>storageKey);

            if (storedValue === null || storedValue === undefined) {
                // If it doesn't exist in storage, save the default value
                await storage.setItem(<StorageItemKey>storageKey, defaultSettings[key]);
            } else {
                // If it exists, update your reactive state
                // (Using 'any' cast temporarily handles varying type properties safely during assignment)
                (this.#settings as any)[key] = storedValue;
            }
        });

        // Run all storage requests concurrently for better performance
        await Promise.all(promises).then(
            () => {
                console.log("Settings initialized with: ", $state.snapshot(this.#settings))
                this.isLoading = false;
            }
        );

    }

    get current() {
        return this.#settings;
    }

    async update<K extends keyof ExtensionSettings>(key: K, value: ExtensionSettings[K]): Promise<void> {
        // 1. Prevent saving raw browser events
        if (value instanceof Event) {
            console.error(`Attempted to set setting "${key}" to a browser Event. Ignoring.`);
            return;
        }

        this.isSaving = true;

        // 2. Optimistically update Svelte state instantly (UI feels snappy)
        (this.#settings as any)[key] = value;

        // 3. Persist to storage in the background
        const storageKey = `local:${key}`;
        await storage.setItem(<StorageItemKey>storageKey, value);

        this.isSaving = false;
    }
}