function postsCode(){

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200){
                loadComponents();
        }
    };
    let sourceUrl = "components/posts.xml";
    if(!xhr.open("GET", sourceUrl, true)){
        sourceUrl = "../" + sourceUrl;
    }
    xhr.open("GET", sourceUrl, true);
    xhr.send();

    function getPosts () {
        const langAttr = document.getElementsByTagName("html")[0].getAttribute("lang");
        let postOutput="", gotPosts, dateAttr, authorAttr, gotItem, gotTitle, gotBody, formattedDateAttr;
        gotPosts = xhr.responseXML.querySelectorAll("post");
        console.log(gotPosts);
        gotPosts.forEach((eachPost)=>{
            dateAttr = eachPost.getAttribute("date");
            authorAttr = eachPost.getAttribute("author");
            gotItem = eachPost.querySelector(`item[lang="${langAttr}"]`);
            gotTitle = gotItem.querySelector("title").innerHTML;
            gotBody = gotItem.querySelector("body").innerHTML;
            formattedDateAttr = new Date(dateAttr).toLocaleDateString(langAttr, {year:"numeric", month:"short", day:"numeric"});
            console.log(gotItem);console.log(gotTitle);console.log(gotBody);console.log(formattedDateAttr);

            postOutput += `
                <article class="post mt-5">
                    <header class="post-header d-flex flex-wrap">
                        <h1 class="post-title w-100">${gotTitle}</h1>
                        <h6 class="post-author mr-3">By <span data-i18n="Tomoaki Morioka">${authorAttr}</span></h6>
                        <h6 class="post-date">${formattedDateAttr}</h6>
                    </header><hr/>
                    <div class="post-body">
                        ${gotBody}
                    </div>
                </article>
            `
        });

        document.getElementById("main").outerHTML = `
            <main id="main" class="bg-white" style="position:relative">
                <div id="page-header" class="container bg-light border-top border-bottom">
                    <h1 class="my-1"><span data-i18n="posts">Posts</span></h1>
                </div>
                <section id="posts" class="container mt-5">${postOutput}</section>
            </main>
        `;
    }
    function loadComponents () {
        getPosts();mediator.componentsAdded=1;
    }

}
postsCode();