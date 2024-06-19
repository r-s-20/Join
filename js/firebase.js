const BASE_URL = "https://rs-testproject01-default-rtdb.europe-west1.firebasedatabase.app/";

async function deleteData(path = "userDB") {
    let response = await fetch(BASE_URL + path + ".json", {
      method: "DELETE",
    });
    console.log("post", response);
    //   let responseJson = await response.json();
    //   console.log(responseJson);
  }
  
  async function putData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
      method: "PUT",
      header: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response;
  }
  
  async function loadData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseJson = await response.json();
    return responseJson;
    // tasksDownloaded = JSON.parse(responseJson.tasks);
    // console.log(tasksDownloaded);
  }