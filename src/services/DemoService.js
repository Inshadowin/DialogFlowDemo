class Demo {
    requestQuery = async (query, onResult, onError) => {
        fetch(`https://cors-anywhere.herokuapp.com/https://console.dialogflow.com/api-client/demo/embedded/67e9854b-6ab5-4157-8339-ffa5a8839af4/demoQuery?q=${query}&sessionId=6db9c531-3ec7-74b4-c28a-2c2d8a12bc02`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                // 'Authorization': 'Bearer ' + this.accessToken,
                'charset': "utf-8"
            },
        })
            .then(function (response) {
                var json = response.json().then(onResult)
            })
            .catch(onError);
    }
}

export default new Demo();