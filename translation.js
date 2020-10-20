let langAttr = document.getElementsByTagName("html")[0].lang;
/* Checking if the file path is correct */
let JsonOfLocale = new XMLHttpRequest().open("GET","locale/"+langAttr+"/"+langAttr+".json")
    ? "locale/"+langAttr+"/"+langAttr+".json"
    : "../locale/"+langAttr+"/"+langAttr+".json";
let jsonData;
/* -------------------- */
/* Creating httpReaquest */
function httpRequest(method, url){
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange =()=>{
        if(xhr.readyState === 4 && xhr.status === 200){
            jsonData = JSON.parse(xhr.responseText); console.log(jsonData);
            checkComponents();
        }
    }
    xhr.open(method, url, true);
    xhr.send()
}
/* ------------------- */
/* Invoking httpRequest */
httpRequest("GET", JsonOfLocale);
/* -------------------- */
/* Setting i18njs */
function bulkTranslateFunc (passedElementsToTranslate) {
    console.log(passedElementsToTranslate.length); console.log(passedElementsToTranslate);
    let addedData, keys, i18nKeys;
    if(jsonData){
        addedData = jsonData;
        i18n.translator.add(addedData);
        keys = Object.keys(addedData.values);
        i18nKeys = [];
        for(let i=0;i<keys.length;i++){
            for(let j=0;j<passedElementsToTranslate.length;j++){
                if(keys[i] == passedElementsToTranslate[j].getAttribute("data-i18n")){
                    passedElementsToTranslate[j].innerHTML = i18n(keys[i]);
                }
            }
        }
        /* formatting the specified date */
        if(document.querySelectorAll("[data-i18n-date]")){
            let datesToFormat = document.querySelectorAll("[data-i18n-date]");
            datesToFormat.forEach((eachDate)=>{
                let dateValue = eachDate.getAttribute("data-i18n-date")
                let i18nDate = new Date(dateValue).toLocaleDateString(langAttr, {year:"numeric", month:"long", day: 'numeric'});
                eachDate.innerHTML = i18nDate;
            });
        }
        /* ----------------------------- */
    }
    let clock = document.getElementById("date-and-time");
    setInterval(()=>{
        let currentDate = new Date();
        let formattedDate = currentDate.toLocaleDateString(langAttr, {year:"numeric", month:"long", day: 'numeric', weekday:"long", hour: '2-digit', minute:"2-digit", second:"2-digit", hour12:"true"});
        clock.innerHTML = formattedDate;
    }, 1000);
}
/* -------------- */
function getElementsToTranslate(){
    let gotElementsToTranslate = document.querySelectorAll("[data-i18n]");
    bulkTranslateFunc(gotElementsToTranslate);
}
function checkComponents(){
    mediator.registerListener(()=>{
        if(mediator.componentsLoaded >= mediator.numOfComponentFiles){
            getElementsToTranslate();
        }
    });
    mediator.componentsAdded = 0;
    setTimeout(()=>{
        if(!(mediator.componentsLoaded >= mediator.numOfComponentFiles)){
            let errorMeassage = document.createElement("div");
            errorMeassage.style.position = "fixed";
            errorMeassage.style.backgroundColor = "#ffffff";
            errorMeassage.style.textAlign = "center";
            errorMeassage.innerHTML = "<h1>Failed to load content or taking too long.</h1><p>Try reloading the page or disable a script blocker if you have one.</p>";
            document.getElementsByTagName("body")[0].prepend(errorMeassage);
        }
        console.log("checking components timed out");
    }, 4000);
}