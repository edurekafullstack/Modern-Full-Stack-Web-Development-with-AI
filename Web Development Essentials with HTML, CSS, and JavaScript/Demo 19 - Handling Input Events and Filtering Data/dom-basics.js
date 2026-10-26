const heading = document.querySelector("#dom-heading");
const message = document.querySelector("#dom-message");

console.log("Original heading:", heading.textContent);
console.log("Original message:", message.textContent);

heading.textContent = "Updating Content with JavaScript";
message.textContent = "JavaScript has updated this paragraph.";

message.classList.add("highlight");