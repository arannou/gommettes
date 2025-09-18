var isAdmin = false
var password
var currentNames = []
var api_url = "http://127.0.0.1:12345/api"
var topThreeScores = {}
function main() {

    // Cors default
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'

    // Get gommettes
    return getGommettes()

}


/*        ROUTES         */
function getGommettes() {
    axios.get(api_url+"/gommettes").then( (req) => {
        var data = req.data.gommettes
        this.topThreeScores = getTopThreeScores(Object.values(data))
        for (var [name, score] of Object.entries(data)) {
            if (score != 0 && score == this.topThreeScores.first) {
                place = "🥇"
            }
            else if (score != 0 && score == this.topThreeScores.second) {
                place = "🥈"
            }
            else if (score != 0 && score == this.topThreeScores.third) {
                place = "🥉"
            }
            else {
                place = ""
            }
            this.currentNames.push({name: name, score: score, place: place})
        }
        displayNames("gommettes-scores", currentNames)
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
    console.log(user)
    var img = `<div class='img'>
            <img src="img/${user.name.toLowerCase()}.png" alt="${user.name}" onerror="onImageError(event)">
        </div>`
    return `
    <div class="gmt-container">
        <div class="gommette" id="${user.name}">
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
    console.log(event)
    event.target.src = "img/user.png"
    event.onerror = null
}

function incrementScore(name) {
    axios.post(api_url+"/gommettes/"+name).then( (req) => {
        getGommettes()
    })
}
