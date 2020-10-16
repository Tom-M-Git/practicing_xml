const lang = document.querySelector("html").getAttribute("lang");

const thePromise = fetch("../posts/2020/posts.json");
thePromise.then((res)=>{
    return res.json();
}).then((jsonData)=>{
    
    /* PAGINATION ========================================== */
    let config = {
        "numOfPosts": Object.entries(jsonData.posts).length,
        "maxPerPage": 5,
        "page": 1,
        "maxPerList": 5
        };
    let numOfPages = Math.ceil( config.numOfPosts / config.maxPerPage);
    /* Solving A Median ---------- */
    let medianOfList = function(){
        let half = Math.ceil(config.maxPerList/2);
        return config.maxPerList % 2 !==0 ? half : (half + (half + 1 ))/2;
    };
    /* Solving A Median END ------ */
    /* NUM OF BUTTONS ON THE SIDE --------- */
    let numOfButtonsOnTheSides =
        config.maxPerList % 2 !==0
        ? {"left":medianOfList() - 1, "right":medianOfList() - 1}
        : {"left":medianOfList() - 1.5, "right":medianOfList() - 0.5};
    /* NUM OF BUTTONS ON THE SIDE END ----- */
    /* ADJUSTING BUTTONS --------- */
    let startOfButtons, endOfButtons;
    function adjustButtons(){
        startOfButtons =
            config.page + numOfButtonsOnTheSides.right > numOfPages
            ? (config.page - numOfButtonsOnTheSides.left) - (config.page + numOfButtonsOnTheSides.right - numOfPages)
            : config.page - numOfButtonsOnTheSides.left >= 1
            ? config.page - numOfButtonsOnTheSides.left
            : (config.page - numOfButtonsOnTheSides.left) - (config.page - numOfButtonsOnTheSides.left) + 1;
        endOfButtons =
            startOfButtons - 1 + config.maxPerList <= numOfPages
            ? startOfButtons - 1 + config.maxPerList
            : (startOfButtons - 1 + config.maxPerList) - (startOfButtons - 1 + config.maxPerList - numOfPages);
        if(startOfButtons < 1){ startOfButtons = 1; }
        /* DEBUGGING --------------- */
        console.log({
            "page": config.page,
            "numOfPages": numOfPages,
            "left": numOfButtonsOnTheSides.left,
            "right": numOfButtonsOnTheSides.right,
            "page + right > numOfPages": config.page + numOfButtonsOnTheSides.right > numOfPages,
            "(page - left) - (page + right - numOfPages)": (config.page - numOfButtonsOnTheSides.left) - (config.page + numOfButtonsOnTheSides.right - numOfPages),
            "page - left": config.page - numOfButtonsOnTheSides.left,
            "(page - left) - (page - left) + 1": (config.page - numOfButtonsOnTheSides.left) - (config.page - numOfButtonsOnTheSides.left) + 1,
            "startOfButtons": startOfButtons
        });
        /* DEBUGGING END ----------- */

    }
    /* ADJUSTING BUTTONS END ----- */
    /* NAV LIST ------------ */
    let pageNavList = document.querySelector("#page-nav-list");
    function initPageNav(){
        pageNavList.innerHTML = "";

        pageNavList.innerHTML += `<li id="page-nav-list-first"><button class="page-nav-list-button" data-page="1">1</button></li>`;
        for(let i = startOfButtons; i <= endOfButtons; i++){
            pageNavList.innerHTML += `<li><button class="page-nav-list-item page-nav-list-button" data-page="${i}">${i}</button></li>`;
        }
        pageNavList.innerHTML += `<li id="page-nav-list-last"><button class="page-nav-list-button" data-page="${numOfPages}">${numOfPages}</button></li>`;

        let currentPage = document.querySelector(`.page-nav-list-item[data-page="${config.page}"]`);
        currentPage.className = currentPage.className.replace("page-nav-list-button", "current-page-button");
    
    /* NAV LIST END -------- */
    /* BUTTON FUNCTIONALITY -------------- */
        let pageButtons = document.querySelectorAll("#page-nav-list li button");
        pageButtons.forEach( (eachButton) => {
            let pageNumber = eachButton.getAttribute("data-page");
            eachButton.addEventListener("click", function(){
                config.page = parseInt(pageNumber); // Attributes from DOM are STRINGs!!
                adjustButtons();
                initPageNav(); //RECURSIVE FUNCTION!
                updatePosts();
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            });
        });
    /* BUTTON FUNCTIONALITY  END --------- */
    }
    adjustButtons();
    initPageNav(); //INIT AT THE BEGINNING

    /* PAGINATION END =======================================*/

    function updatePosts(){
        document.querySelector("#post-container").innerHTML = "";//RESET

        let startOfPosts = (config.page - 1) * config.maxPerPage;
        let endOfPosts =
            config.page * config.maxPerPage <= config.numOfPosts
            ? config.page * config.maxPerPage
            : config.numOfPosts;

        for(let i = startOfPosts; i < endOfPosts; i++){
            let post = jsonData.posts[i];
            let entries = Object.entries(post.locale);
            

            /* Making Fake Permalinks ================================== */
            let englishTitle = post.locale.en.title;
            englishTitle = englishTitle.toLowerCase();
            englishTitle = englishTitle.replace(/[\W_\s]+/igm, "_");
            let postDate = post.date.replace(/-/g, "_");
            let permalink = postDate + "_" + englishTitle;
            /* Fake Permalinks End ===================================== */

            /* A FUNCTION TO INSERT CONTENT TO DOM ================ */
            function displayPosts(value){

                if(value.body == ""){return;}
                let regex = new RegExp(`(?<=<img.*)(?<=src="|src=')(?!http)[^'"]+(?='|")`, `img`);
                let matched = value.body.match(regex);
                if(matched){
                    matched.forEach( (eachMatched) => {
                        value.body = value.body.replace(eachMatched, "../posts/2020/" + eachMatched);
                    });
                } else {
                    value.body = value.body.replace(regex, "../posts/2020/" + matched);
                }
                value.body = value.body.replace(/(\.\.\/posts\/2020\/){2,}/igm, "../posts/2020/");//delete duplicates in urls

                let newThumbnailUrl = "";
                if(value.thumbnail_url != ""){
                    newThumbnailUrl = value.thumbnail_url.replace(/.*/, `<img class="post-thumbnail" src="../posts/2020/${value.thumbnail_url}" alt="thumbnail" />`);
                }

                let newAuthorIconUrl = "";
                if(value.author_icon_url != ""){
                    newAuthorIconUrl = value.author_icon_url.replace(/.*/, `<img class="post-author-icon" src="../posts/2020/${value.author_icon_url}" alt="icon" />`);
                }

                document.querySelector("#post-container").innerHTML += `
                    <div class="post" id="${permalink}">
                        <div class="post-header">
                            ${newAuthorIconUrl}
                            <h2 class="post-title"><a href="./post.html#${permalink}">${value.title}</a></h2>
                            <span class="post-author">By ${value.author}</span>
                            <span class="post-date">${value.date_local}</span>
                            <span class="post-read-more"><a href="./post.html#${permalink}">Read…</a></span>
                            <div class="post-thumbnail">${newThumbnailUrl}</div>
                        </div>
                    </div>
                `;
            }
            /* THE FUNCTION ENDS =================================== */
            if(!lang){
                displayPosts(post.locale.en);
            }
            entries.forEach( ([key, value]) => {
                if(key == lang){
                    displayPosts(value);
                }
            });
        }
    }
    updatePosts();

    /* NO CONTENT MESSAGE IF CONTENT IS UNAVAILABLE */
    if(!document.querySelector("#post-container .post")){
        let noContent = document.querySelector("#post-container");
        noContent.innerHTML = `<h1 id="no-content">No Content</h1>`;
        pageNavList.innerHTML = "";
    }
    /* NO CONTENT END ====================================== */
});