const formFile = document.querySelector("#formFileLg");
const displayHtml = document.querySelector("#displayText");
const checkButton = document.querySelector("#checkButton");
const errorSelector = document.querySelector(".error");


formFile.addEventListener("change", function () {
  checkButton.style.visibility = "visible";
  let file = formFile.files[0];
  let reader = new FileReader();
  reader.addEventListener("load", function (e) {
    let text = e.target.result;
    displayHtml.innerHTML = text;
  });
  reader.readAsText(file);
 
  errorSelector.style.display = "none";
});


checkButton.addEventListener("click", function (event) {
  event.preventDefault();
  errorSelector.style.display = "none";
  if (formFile && formFile.files.length === 0) {
    errorSelector.style.display = "block";
    return;
  }
  checkButton.style.display = "none";
  formFile.value = null;
  let lines = displayHtml.innerHTML.split("\n");
  
  lines.forEach(async (line, index) => {
    return fetch(
      `https://api.textgears.com/spelling?text=${line}&language=en-GB&whitelist=&dictionary_id=&key=z88J6TXRGQ8HDrxp`
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        
        data.response.errors.forEach((error) => {
          
          let suggestion = "";
          error.better.forEach((element, index) => {
            suggestion += `<li class="my-tooltip-options ${error.bad}-${index}" onclick="handleChange()">${element}</li>`;
          });

        
          let newHtml = `<div class="my-tooltip">${error.bad}<span class="my-tooltiptext"><ul>${suggestion}</ul></span></div>`;
          displayHtml.innerHTML = displayHtml.innerHTML.replaceAll(
            error.bad,
            newHtml
          );
        });
      });
  });
});


const handleChange = function () {
  
  let parent = this.event.target.closest(".my-tooltip");
  parent.replaceWith(this.event.target.innerHTML);
};
