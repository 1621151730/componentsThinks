let titleNode = document.querySelector(".title");
let switchNode = document.querySelector("#switch");

switchNode.addEventListener("change", (e) => {
  titleNode.innerText = e.target.checked
})