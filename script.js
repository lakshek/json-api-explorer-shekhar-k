
const postFormEl = document.getElementById("postForm");
const formErrorEl = document.getElementById("formError");
const formSuccessEl = document.getElementById("formSuccess");
const fetchButtonEl = document.getElementById("fetchButton");
const errorEl = document.getElementById("error");
const postListEl = document.getElementById("postList");

//Submit post function
postFormEl.addEventListener("submit", event => {
    event.preventDefault();         //prevent clearing the form before processing
    formErrorEl.textContent = "";
    formSuccessEl.textContent = "Submitting...";  //message to inform the user

    const titleEl = document.getElementById("titleInput");
    const bodyEl = document.getElementById("bodyInput");
    const title = titleEl.value;
    const body = bodyEl.value;

    fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body}),
    })
    .then(response => {                     //capture response 
        console.log(response.status);       //log the response whether fetch is successful or in error

    //if the server sends an error in reponse, display error, and stop the process
        if (!response.ok) {
            console.log(`Server error! status: ${response.status}`);
            return;
        };
    //return json data
        return response.json();
    })
    .then(data => {                         //capture data
        formSuccessEl.innerHTML = `Post created! ID: ${data.id} <br> Title: ${data.title}`;
        formErrorEl.textContent = "";
        
        postFormEl.reset();         //clear the form after successful posting
    })
    //display error if there is an error submitting
    .catch(error => {
        formSuccessEl.textContent = "";         //clear any message that might exist
        formErrorEl.textContent = `Error submitting post.`;
        console.log("Submit Error:", error);
    });

});

//fetch posts function - limited to 2 entries
fetchButtonEl.addEventListener("click", () => {
    errorEl.textContent = "Loading...";
    postListEl.textContent = "";
    
    fetch("https://jsonplaceholder.typicode.com/posts")
    .then(response => {                     //capture response
        console.log(response.status);       //log the response whether fetch is successful or in error

    //if the server sends an error in reponse, display error, and stop the process
        if (!response.ok) {
            console.log(`HTTP error! status: ${response.status}`);
            return;
        };
    //return json data
        return response.json();
    }) 
    .then(posts => {                        //capture data
        errorEl.textContent = "";
        
        posts.slice(0, 3).forEach(post => {     //display only 2 entries
            const postEl = document.createElement("div");
            postEl.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.body}</p>
                <button class="delete-btn" data-id="${post.id}">Delete Blog</button>`;
            postListEl.appendChild(postEl);
        });
    })
    //display error if there is an error fetching
    .catch(error => {
        errorEl.textContent = "Error fetching posts.";
        console.log("Fetching error:", error.message)
    });
});

//delete blog function using async/await fetch method
postListEl.addEventListener("click", async (event) => {     //listen to a click in postList class
  if (event.target.classList.contains("delete-btn")) {      //process if delete-btn is clicked
    const postId = event.target.dataset.id;                 //get the dataset.id for the blog post to be deleted
    const postEl = event.target.closest("div");             //find the associated div containing the id

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
        method: "DELETE"
      });

    //if the server sends an error in response, diaply error, and stop the process
      if (!response.ok) {
        console.log(`Server error: ${response.status}`);
        return;
      }

      postEl.remove();      //remove the blogpost
      errorEl.textContent = "Post deleted.";    //display message 
    } catch (err) {         //display error if there is an error deleting
      errorEl.textContent = "Error deleting post.";
      console.error(err);
    }
  }
});

