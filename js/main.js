
// Singleton class FirstCommit
var FirstCommit = new function(){
    var outputDiv;
    
    this.init = function(outputDivRef,buttonRef,usernameTextRef,repoTextRef){
        usernameTextRef.focus();
        
        outputDiv = outputDivRef;

        buttonRef.onclick = function(){
            fetch(usernameTextRef.value, repoTextRef.value);
        }

        document.onkeydown = function(){
            if (event.keyCode == 13){
                buttonRef.click();
            }
        }
    }

    function display(jsonRes){
        if(!jsonRes){
            outputDiv.innerHTML = "<div class='loading'>Invalid input :(</div>";
            return;
        }

        var date = getDate('"' + jsonRes[0].commit.author.date.split("T")[0] + '"');
        var author = jsonRes[0].author;
        var authorProfileURL = "";
        if(author){
            authorProfileURL = author.html_url;
        }
        var output = 
            ("<div><a class='message' href='" +
             jsonRes[0].html_url + "'>" + jsonRes[0].commit.message + "</div>" + 
             "<span ><a class='name' href='" + 
             authorProfileURL + "'>" + jsonRes[0].commit.author.name + "</a></span>" +
             "<span class='date'> commited on " + date + "</span>");

        outputDiv.innerHTML = output;
    }

    function fetch(username,repo){
        outputDiv.innerHTML = "<div class='loading'>Loading...</div>";
        getFirstCommit(username,repo,display);
    }

    function getDate(commitDate){

    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    
    var date = new Date(commitDate);
    console.log(date);
    var dateString = (date.getDate() + " " + monthNames[date.getMonth()] + " " + 
                      date.getFullYear());

    return dateString;
    }

    function getFirstCommit(username,repo,callback){
        function callGetFirstCommit(commitCount){
            console.log("No of commits = " + commitCount);
            getFirstCommitImpl(username,repo,commitCount,callback);
        }

        getNoOfCommits(username,repo,callGetFirstCommit);
    }

    // callback funciton will be called after fetching the result
    function getFirstCommitImpl(username,repo,commitCount,callback){
        if(commitCount == 0){ // No data found
            callback(null);
        }
        var url = ("https://api.github.com/repos/" + username + "/" + repo + "/commits" +
                   "?per_page=1&page=" + commitCount);
        //console.log(url);
        var xhr = new XMLHttpRequest();
        xhr.open("GET",url,true);
        xhr.onload = function(){
            var jsonResponse = this.responseText;
            var parsedJsonResponse = JSON.parse(jsonResponse);
            console.log(parsedJsonResponse);
            callback(parsedJsonResponse);
        }
        xhr.onerror = function(){
            console.log("xml http request error");
        }
        xhr.send();
    }

    function getNoOfCommits(username,repo,callback){
        var url = ("https://api.github.com/repos/" + username + "/" + repo + "/commits" +
                   "?per_page=1&page=1");
        var xhr = new XMLHttpRequest();
        xhr.open("GET",url,true);
        xhr.onload = function(){
            var res = this.getResponseHeader('link');
            if(!res){
                callback(0);//Meaning no data found
            }
            var nextAndLastPageNumbers = res.match(/&page=[0-9]+/g);
            var lastPage = nextAndLastPageNumbers[1].split('=')[1];
            callback(parseInt(lastPage));
        }
        xhr.onerror = function(){
            console.log("xml http request error");
        }
        xhr.send();
    }

    //http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    function getParameterByName(name, url) {
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }  
}



