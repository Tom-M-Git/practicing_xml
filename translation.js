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
            getElementsToTranslate();
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
    }
}
/* -------------- */
// function linstenToComponents(callbackFunc){
//     let componentsStatus = document.querySelector("script[data-components]");
//     console.log(componentsStatus.getAttribute("data-components"));
//     if(componentsStatus.getAttribute("data-components") == "on"){
//         callbackFunc();
//     }
// }
function getElementsToTranslate(){
    let gotElementsToTranslate = document.querySelectorAll("[data-i18n]");
    bulkTranslateFunc(gotElementsToTranslate);
}