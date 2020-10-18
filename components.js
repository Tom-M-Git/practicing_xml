function componentsCode(){

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200){
                loadComponents();
        }
    };
    let sourceUrl = "components/headerandfooter.xml";
    if(!xhr.open("GET", sourceUrl, true)){
        sourceUrl = "../" + sourceUrl;
    }
    xhr.open("GET", sourceUrl, true);
    xhr.send();

    function getHeader () {
        let gotHeader = xhr.responseXML.getElementsByTagName("header");
        document.getElementById("header").outerHTML = gotHeader[0].outerHTML;
    }
    function getFooter () {
        let gotFooter = xhr.responseXML.getElementsByTagName("footer");
        document.getElementById("footer").outerHTML = gotFooter[0].outerHTML;
    }
    function loadComponents () {
        getHeader();getFooter();mediator.componentsAdded=1;
    }

}
componentsCode();