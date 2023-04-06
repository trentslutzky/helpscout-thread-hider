
const observer = new MutationObserver(function(mutationList, observer) {
  injectButtons();
});

options = { attributes: false, childList: true, subtree: true };
observer.observe(document, options);

function injectButtons(){
  chrome.storage.local.get(["state"]).then((res) => {
    new_state = "enabled";
    if(res.state){
      new_state = res.state;
    }
    console.log(new_state);
    if(new_state == "enabled"){
      refreshThreads();
      articles = document.querySelectorAll("article.thread.customer");
      articles.forEach(article => addButtonToCustomerThread(article));
    }
  });
}

function refreshThreads(){
  chrome.storage.local.get(["hsth_hidden_threads"]).then((res) => {
    articles = document.querySelectorAll("article.thread.customer");
    articles.forEach(article => {
      let thread_id_string = article.id;
      let thread_id = thread_id_string.split("-")[1];
      let body_section = article.querySelector("section.js-thread-content > section.messageBodyWrap > section.message > section.messageBody");
      if(res.hsth_hidden_threads){
        if(res.hsth_hidden_threads.includes(thread_id)){
          body_section.style.display = "none";
        } else {
          body_section.style.display = "block";
        }
      }
    });
  })
}

function addButtonToCustomerThread(article) {

  chrome.storage.local.get(["hsth_hidden_threads"]).then((res) => {
    let thread_id_string = article.id;
    let thread_id = thread_id_string.split("-")[1];

    button_classname = "hsth-button";
    if(article.querySelector("."+button_classname) != null){
      return;
    }

    let meta_section = article.querySelector("section.js-thread-content > section.messageBodyWrap > section.message > section.threadHeader > section.meta");

    let btn = document.createElement("button");
    btn.id = thread_id+"-button";

    let hide = false;
    if(res.hsth_hidden_threads){
      if(res.hsth_hidden_threads.includes(thread_id)){
        btn.innerHTML = "hidden";
        btn.setAttribute("show", true);
      } else {
        hide = true;
        btn.innerHTML = "hide";
        btn.setAttribute("show", false);
      }
    } else {
      hide = true;
      btn.innerHTML = "hide";
      btn.setAttribute("show", false);
    }

    btn.addEventListener("click", function(){
      let button = document.getElementById(thread_id+"-button");
      let current_hidden_threads_state = chrome.storage.local.get(["hsth_hidden_threads"]).then((local) => {
        current = local.hsth_hidden_threads;
        var result = []
        if(button.getAttribute("show") == "false"){
          button.setAttribute("show", true);
          button.innerHTML = "hidden";
          if(current){
            current.push(thread_id);
            result = current;
          } else {
            result = [thread_id];
          }
        } else {
          button.setAttribute("show", false);
          button.innerHTML = "hide";
          if(current){
            result = current.filter(function(x) {
              return x !== thread_id;
            })
          }
        }
        chrome.storage.local.set({hsth_hidden_threads: result}).then(() => {
          refreshThreads();
        })
      })
    })

    btn.className = button_classname;

    meta_section.append(document.createElement("br"));
    meta_section.append(btn);
  })
}

