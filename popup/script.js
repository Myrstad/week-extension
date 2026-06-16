// Tab navigation
const navButtons = document.querySelectorAll("a")
const tabElements = document.querySelectorAll("main .tab")
const backButton = document.querySelector("nav > a")
const tabButtons = document.querySelectorAll("nav .middle a")

navButtons.forEach(button =>{
    button.addEventListener("click", e=>{
        const destination = button.href.split("#")[1]
        //hide all tabs
        tabElements.forEach(elem=>elem.classList.remove("active"))
        //activate correct tab
        tabElements.forEach(elem=>{
            if (elem.id == destination)
                elem.classList.add("active")
        })
        //if sub tab (inner setting) show back arrow else remove
        if (destination.indexOf("_") != -1)
            backButton.classList.add("active");
        else
            backButton.classList.remove("active");
        
        //highlight nav chip
        if (destination == "home") {
            tabButtons[0].classList.add("active")
            tabButtons[1].classList.remove("active")
        } else {
            tabButtons[1].classList.add("active")
            tabButtons[0].classList.remove("active")
        }
            
    })
})

// Set week number
function getWeekNumber() {
    Date.prototype.getWeek = function () {
		var target = new Date(this.valueOf());
		var dayNr = (this.getDay() + 6) % 7;
		target.setDate(target.getDate() - dayNr + 3);
		var firstThursday = target.valueOf();
		target.setMonth(0, 1);
		if (target.getDay() != 4) {
		target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
		}
		return 1 + Math.ceil((firstThursday - target) / 604800000);
    };
  
    var d = new Date();
    let result = d.getWeek();
    return result;
}

// Local (extension) storage functionality/init
/**
 * 
 * @param {String} key browser localstorage key name
 * @param {Object} defaultValue default value (object) for key
 * @returns {Promise} Promise with .[key] for preferences object
 */
async function initLocalstorage(key, defaultValue) {
    return new Promise((resolve, reject) =>{
        let preferences;
        browser.storage.local.get(key).then(res=>{
            if (res[key]) preferences = res
            else {
                preferences = defaultValue
            
                browser.storage.local.set( {[key]: preferences } ).catch(err=>{
                    console.error(err);
                    reject(err)
                    return;
                });
            }
            resolve(preferences)
        }, err=>{
            console.error(err);
            reject(err);
        });
    })
}

initLocalstorage("suffix", {"enabled": false, "value": "custom", "custom": "<3" });

initLocalstorage("prefix", { "enabled": true, "value": "Week", "custom": "Custom" });

initLocalstorage("popup", { "theme": "auto", "accent": "accent", "accentColor": "#ACBAF3" });

initLocalstorage("icon", {
    "selectedFont": "Inter",
    "font": "Inter",
    "fontSize": 10,
    "selectedColor": "auto",
    "customColor": "#F3ACE6",
    "color": "auto"
});

// Get from local storage
async function getFromStorage(key) {
    return new Promise((resolve, reject) => {
        browser.storage.local.get(key).then(res=>{
            console.log(`Fetched from ${key}:`, res[key]);
            resolve(res[key]);
        }).catch(err=>{
            console.error("err:", err);
            reject(err);
        });
    });
}
getFromStorage("icon");

// Copy week number with/without prefix and suffix given from localstorage
const resultElement = document.querySelector("#home h1")
resultElement.textContent = getWeekNumber()
resultElement.addEventListener("click", ()=>{
    navigator.clipboard.writeText(getWeekNumber())
})

// Forms, make sure only one checkbox is checked at a time
const formElements = document.querySelectorAll("form")
formElements.forEach(formEl => {
    formEl.addEventListener("change", e=>{        
        const checkBoxes = formEl.querySelectorAll("input")
        checkBoxes.forEach(box=>box.checked=false)
        e.target.checked = true
    })
    formEl.addEventListener("submit", e=>e.preventDefault())
})

// Customizable (textfield like) form label and making sure functionality is kept in tact
const editableLabels = document.querySelectorAll(".label-with-editable-span")
editableLabels.forEach(label=>{
    const span = label.querySelector("span")
    const checkbox = label.previousElementSibling;

    label.addEventListener("click",(e)=>{
        e.preventDefault()

        if (checkbox) {
            checkbox.checked = true;
            const changeEvent = new Event("change", {bubbles:true})
            checkbox.dispatchEvent(changeEvent)
        }
        
        if (span) {
            span.focus()
        }
    })
})

// Color picker buttons
const colorPickerButtons = document.querySelectorAll("label:has(button, + color-picker) button")
colorPickerButtons.forEach(button=>{
    button.addEventListener("click", (e)=>{
        console.log(e.explicitOriginalTarget.tagName,e.explicitOriginalTarget.tagName=="BUTTON");
        
        if(e.explicitOriginalTarget.tagName=="BUTTON") {
            const colorPicker = button.parentElement.nextElementSibling        
            colorPicker.focus({focusVisible: true})
        }
        
    })  

})

// Popup theme settings
function setDarkMode() {
    document.querySelector("body").classList.add("dark")
}
function setLightMode() {
    document.querySelector("body").classList.remove("dark")
}

// Proof of concept, TODO: integrate with local/extension storage
const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)");
if (darkModePreference.matches) setDarkMode();
darkModePreference.addEventListener("change", e=>{
    if (e.matches)
        setDarkMode();
    else
        setLightMode();
})

// Custom events on ´color-picker´

document.querySelectorAll("color-picker").forEach(colorPicker=>{
    console.log(colorPicker);
    
    colorPicker.addEventListener("color-close",e=>{
        const labels = e.target.parentElement.querySelectorAll("label")
        console.log(labels, labels.length, labels[labels.length - 1]);

        labels[labels.length - 1].focus()
    })

    colorPicker.addEventListener("color-selected", e=>{
        console.log(e.target.id);
        if (e.target.id == "accent-custom-picker") {
            document.body.style.setProperty("--accent", e.detail.color)
        } else if (e.target.id == "icon-custom") {
            document.body.style.setProperty("--icon", e.detail.color)
        }
        const labels = e.target.parentElement.querySelectorAll("label");
        labels[labels.length - 1].focus()
    })
})
