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

// Icon change color
