var currentGommettes = []
var topThreeScores = {}
function main() {

    // Get gommettes
    return getGommettes()

}

function getGommettes() {
    get_all_objects("gommette").then( (response) => {
        var data = response.gommette
        this.currentGommettes = []
        this.topThreeScores = getTopThreeScores(data.map(gommette => gommette.score))
        for (var gmt of data) {
            if (gmt.score != 0 && gmt.score == this.topThreeScores.first) {
                place = "🥇"
            }
            else if (gmt.score != 0 && gmt.score == this.topThreeScores.second) {
                place = "🥈"
            }
            else if (gmt.score != 0 && gmt.score == this.topThreeScores.third) {
                place = "🥉"
            }
            else {
                place = ""
            }
            this.currentGommettes.push({id: gmt.id, name: gmt.name, score: gmt.score, place: place})
        }
        displayNames("gommettes-scores", currentGommettes)
    })
}

function getTopThreeScores(scores) {
  // Remove duplicates, sort in descending order
  let uniqueScores = [...new Set(scores)].sort((a, b) => b - a);
  return {
    first: uniqueScores[0] ?? null,
    second: uniqueScores[1] ?? null,
    third: uniqueScores[2] ?? null
  };
}

function nameHTML(user) {
    var img = `<div class='img'>
            <img src="users/${user.name.toLowerCase()}.png" alt="${user.name}" onerror="onImageError(event)">
        </div>`
    return `
    <div class="gmt-container">
        <div class="gommette" id="${user.name}">${img}
            <div class="username">${user.name}</div>
            <div class="podium">${user.place}</div>
            <div class="userscore">${user.score}</div>
            <span class="btn" onclick="incrementScore('${user.name}')">+1</span>
        </div>
    </div>`
}

function displayNames(elementID, nameList) {
    var namesElement = document.getElementById(elementID)
    var namesHTML = ""

    for(var name of nameList)
        namesHTML+=nameHTML(name)

    namesElement.innerHTML = namesHTML
}

function onImageError(event) {
    event.target.src = "img/user.png"
    event.onerror = null
}

function incrementScore(username) {
    const currentUser = this.currentGommettes.find(user => user.name == username)
    if (!currentUser) throw "User unknown"
    currentUser.score++
    delete currentUser.place
    update_object("gommette", currentUser.id, currentUser).then(() => {
        getGommettes()
    })
}

function createUser(username) {
    const item = {
        "name": username,
        "score": 0
    }
    create_object("gommette", item).then(() => {
        getGommettes()
    })
}

function deleteUser(username) {
    const currentUser = this.currentGommettes.find(user => user.name == username)
    console.log(currentUser)
    delete_object("gommette", currentUser.id).then(() => {
        getGommettes()
    })
}

function resetScores(pwd) {
    fetch(BASE_URL+"/api/gommette/reset", {
        "headers": HEADERS,
        "referrerPolicy": "strict-origin-when-cross-origin",
        "method": "POST",
        "body": JSON.stringify({"password": pwd}),
        "mode": "cors"
    }).then((r) => {
        if (!r.ok) {
            handleError(r)
        }
        getGommettes()
    })
}

function overwriteScores(pwd, data) {
    fetch(BASE_URL+"/api/gommette/overwrite", {
        "headers": HEADERS,
        "referrerPolicy": "strict-origin-when-cross-origin",
        "method": "POST",
        "body": JSON.stringify({"password": pwd, "data": data}),
        "mode": "cors"
    }).then((r) => {
        if (!r.ok) {
            handleError(r)
        }
        getGommettes()
    })
}

function help() {
    console.log("createUser(username), getGommettes(), incrementScore(username), deleteUser(username)")
    console.log("resetScores(pwd), overwriteScores(pwd, data)")
}
