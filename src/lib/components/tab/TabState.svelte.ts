type tabs = "home" | "settings"

let currentTab: tabs = $state("home")

export function getCurrentTab(): tabs {
    return currentTab
}

export function setCurrentTab(newTab: tabs) {
    currentTab = newTab
}
