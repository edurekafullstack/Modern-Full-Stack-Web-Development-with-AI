const interestForm = document.querySelector(".learning-form");
const nameInput = document.querySelector("#full-name");
const topicSelect = document.querySelector("#learning-topic");
const formFeedback = document.querySelector("#form-feedback");

function handleSubmit(event) {
    event.preventDefault();

    const enteredName = nameInput.value.trim();

    if (enteredName === "") {
        nameInput.setCustomValidity(
            "Enter a name containing more than spaces."
        );

        nameInput.reportValidity();

        return;
    }

    formFeedback.textContent = `Example checked for ${enteredName}. Selected topic: ${topicSelect.value}. No registration has been created.`;
}

function clearFeedback() {
    nameInput.setCustomValidity("");
    formFeedback.textContent = "";
}

interestForm.addEventListener("input", clearFeedback);

interestForm.addEventListener("submit", handleSubmit);