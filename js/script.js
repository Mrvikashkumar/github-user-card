//* Select DOM
const userImg = document.querySelector('.user-img');
const userCar = document.querySelector('.user-card');
const searchBox = document.querySelector('.search-box input');
const slashBtn = document.querySelector('.slash-btn');

//*show message for when document is loaded
window.addEventListener('DOMContentLoaded', ()=>{
  userCar.innerHTML =  `<b style="text-align: center; font-family: poppins; font-style: italic;">To see any GitHub user car first press forward slash "/" and type their name and then press enter!</b>`
})

//* press / to focus search bar
window.addEventListener('keyup', (e) => {
  if (e.key == "/") {
    slashBtn.click();
  }
})

function focusSearchBox() {
  searchBox.value = "";
  searchBox.focus()
}

slashBtn.addEventListener('click', focusSearchBox)

//* github user api
const URL = "https://api.github.com/users";

//* I am using XMLHttpRequest
// we can also use fetch api and this better than Http request
const xhr = new XMLHttpRequest();

function getGitHubUsers(method, url) {
  return new Promise((resolve, reject) => {
    xhr.open(method, url);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response);
      } else {
        reject(new Error("Something went wrong!"))
      }
    }
    xhr.onerror = () => {
      reject(new Error("Please check your internet connection!"))
    }
    xhr.send();
  })
}

function getUserBySearch(name) {
  // let userName = searchBox.value;
  getGitHubUsers("GET", URL)
    .then(resolve => JSON.parse(resolve))
    .then(data => {
      console.log(data)
      //* here I am using fetch api instead of Http request
      fetch('https://api.github.com/users/' + name)
        .then(resolve => resolve.json())
        .then(data => {
          if (data.email == null) {
            data.email = `<i>Email not given</i>`
          }
          if (data.bio == null) {
            data.bio = `<i>Bio not given</i>`
          }
          if(data.location == null){
            data.location = ''
          }
          //* HTML for user card
          userCar.innerHTML = `
            <div class="user-img">
              <img src="${data.avatar_url}" alt="user_avatar">
            </div>
            <div class="user-info">
              <div class="info-top">
                <span class="user-id">User Id : ${data.id}. </span>
                <h2 class="user-name" title="${data.name}">${data.name}</h2>
                <span class="location">${data.location}</span>
              </div>
              <div class="user-email">
                <h4>E-mail : </h4>
                <span>${data.email}</span>
              </div>
              <div class="user-bio">
                <h4>Bio : </h4>
                <span>${data.bio}</span>
              </div>
              <div class="blog">
                <h4>Blog : </h4>
                <a href="${data.blog}">Go to blog to read more</a>
              </div>
              <div class="user-stats">
                <div class="followers">
                  <p>Followers</p>
                  <span>${data.followers}</span>
                </div>
                <div class="following">
                  <p>Following</p>
                  <span>${data.following}</span>
                </div>
                <div class="repos">
                  <p>Repository</p>
                  <span>${data.public_repos}</span>
                </div>
              </div>         
              <div class="info-bottom">
                <div class="created-date">
                  <p>Created at</p>
                  <span>${data.created_at}</span>
                </div>
                <div class="repo-link">
                  <a href="${data.html_url}">Go to repo</a>
                </div>
              </div>
            </div>
            `
        })
    })
}

//* function and event listener for search users
searchBox.addEventListener('keypress', (e)=>{
  if(searchBox.value.length>=1 && e.key == "Enter"){
    let userName = searchBox.value;
    getUserBySearch(userName)
  }
})
