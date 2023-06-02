const searchInput = document.getElementById("search-input")
const apiKey = "AIzaSyCds_-IZYzD-fj1fXdZm09efcUUM2OsWks";
const container = document.getElementById("container")

function searchVideos() {
    let searchValue = searchInput.value;

    fetchVideos(searchValue);
}

async function fetchVideos(searchValue) {
    let endpoint = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${searchValue}&key=${apiKey}`

    try{
        let response = await fetch(endpoint);
    let result = await response.json();

    for(let i = 0; i<result.items.length; i++){
        let video = result.items[i];
        let videoStats = await fetchStats(video.id.videoId)
        if(videoStats.items.length > 0)
        result.items[i].videoStats = videoStats.items[0].statistics 
    }   
    showThumnail(result.items);
    }

    catch(error){
        console.log("error occured" + error);
    }
}

function showThumnail(items){
     for(let i = 0; i<items.length; i++){
        let videoItem = items[i];
        let imageUrl = videoItem.snippet.thumbnails.high.url;
        let divElement = document.createElement("div");
        const divChildren = `
            <img class="image" src = "${imageUrl}"/>
            <p class="title">${videoItem.snippet.title} </p>
            <p class="channel-name">${videoItem.snippet.channelTitle}</p>
            <p>${videoItem.videoStats ? videoItem.videoStats.viewCount: "NA"}</p>

        `
        divElement.innerHTML = divChildren;
        container.appendChild(divElement);
     }
}

async function fetchStats (videoId){
    const endpoint = `https://www.googleapis.com/youtube/v3/videos?part=statistics&maxResults=12&id=${videoId}&key=${apiKey}`
    let response = await fetch(endpoint);
    let result = await response.json();
    return result;
}
