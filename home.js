function homeMainCode(){

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200){
                loadComponents();
        }
    };
    let sourceUrl = "components/home.xml";
    if(!xhr.open("GET", sourceUrl, true)){
        sourceUrl = "../" + sourceUrl;
    }
    xhr.open("GET", sourceUrl, true);
    xhr.send();

    function getMain () {
        const langAttr = document.getElementsByTagName("html")[0].getAttribute("lang");
        let gotMain = xhr.responseXML.querySelector(`main[lang="${langAttr}"]`);
        document.getElementById("main").outerHTML = gotMain.outerHTML;
    }
    function loadComponents () {
        getMain();mediator.componentsAdded=1;
    }

}
homeMainCode();