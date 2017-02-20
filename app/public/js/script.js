const addOptionBtn = document.querySelector("#addOptionBtn")

// Add element form for new poll option
function addOption() {
  const optionsLength = document.querySelectorAll("#feedback-form-option").length
  const optionsDiv = document.querySelector(".form-options")
  const inner = `
    <label for="feedback-form-option">Option ${optionsLength + 1}</label>
    <input type="text" class="form-control" id="feedback-form-option" placeholder="Enter option">
  `
  const elem = document.createElement("div")

  elem.innerHTML = inner
  optionsDiv.appendChild(elem)
}

addOptionBtn.addEventListener("click", addOption)
