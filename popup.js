button_color_disabled = "#a03434";
button_color_enabled = "#629562";

button = document.getElementById("enable-button");
reload_required_text = document.getElementById("reload-required");
button.style.opacity = 0;

chrome.storage.local.get(["state"]).then((res) => {
  new_state = "enabled";
  if(res.state){
    new_state = res.state;
  }
  button.innerHTML = new_state;
  if(new_state != "enabled"){
    button.style.background = button_color_disabled;
  } else {
    button.style.background = button_color_enabled;
  }
  button.style.opacity = 1;
})

button.onclick = async function (e) {
  chrome.storage.local.get(["state"]).then((res) => {
    new_state = "enabled";
    if(res.state){
      if(res.state == "enabled"){
        new_state = "disabled";
      }
    }
    chrome.storage.local.set({state: new_state}).then(() => {
      reload_required_text.style.opacity = 1;
      button.innerHTML = new_state;
      if(new_state != "enabled"){
        button.style.background = button_color_disabled;
      } else {
        button.style.background = button_color_enabled;
      }
    })
  })
}

