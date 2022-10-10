let minutes = 0;
let seconds = 0;
const TEN = 10;
let bobms = 0;
let mat = [];
for (let i = 0; i < TEN; ++i) {
    mat[i] = [];
}
const neighbors = [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]];
countTime = setInterval(timer, 1000);
generateElements();
generateBoard();

function timer() {
    if (seconds < 59) {
        ++seconds;
    } else {
        ++minutes;
        seconds = 0;
    }
    if (seconds < TEN) {
        document.getElementById("timer").innerHTML = minutes + ':0' + seconds + ' ⏱';
    } else {
        document.getElementById("timer").innerHTML = minutes + ':' + seconds + ' ⏱';
    }
}

function generateElements() {
    while (bobms < TEN * 2) {
        let randomLine = Math.floor(Math.random() * TEN);
        let randomColumn = Math.floor(Math.random() * TEN);
        if (mat[randomLine][randomColumn] != '💣') {
            mat[randomLine][randomColumn] = '💣';
            ++bobms;
        }
    }
    for (let i = 0; i < TEN; ++i) {
        for (let j = 0; j < TEN; ++j) {
            if (mat[i][j] != '💣') {
                let dangerGrade = 0;
                for (let k = 0; k < neighbors.length; ++k) {
                    if (i + neighbors[k][0] >= 0 && i + neighbors[k][0] < TEN &&
                        j + neighbors[k][1] >= 0 && j + neighbors[k][1] < TEN && 
                        mat[i + neighbors[k][0]][j + neighbors[k][1]] == '💣') {
                            ++dangerGrade;
                    }
                }
                if (dangerGrade > 0) {
                    mat[i][j] = dangerGrade;
                } else {
                    mat[i][j] = '';
                }
            }
        }
    }
}

let showList = [];
let k = 0;

function generateBoard() {
    for (let i = 0; i < TEN; ++i) {
        for (let j = 0; j < TEN; ++j) {
            let button = document.createElement('button');
            button.className = 'cell';
            button.id = [i, j];
            button.addEventListener("mousedown", event => {
                if (event.button == 0) {
                    showList.push([i, j]);
                    showElements();
                } else if (event.button == 2) {
                    flagMark([i, j]);
                }
            }, false);
            document.getElementById('gameBoard').appendChild(button);
        }
    }
}

function showElements() {
    if (document.getElementById(showList[k]).innerHTML == '🚩') {
        ++bobms;
        document.getElementById('bombs').innerHTML = bobms + '💣';
    }
    document.getElementById(showList[k]).disabled = 'true';
    document.getElementById(showList[k]).innerHTML = mat[showList[k][0]][showList[k][1]];
    statusCheck(mat[showList[k][0]][showList[k][1]]);
    if (mat[showList[k][0]][showList[k][1]] == 1) {
        document.getElementById(showList[k]).style.color = 'green';
    } else if (mat[showList[k][0]][showList[k][1]] == 2) {
        document.getElementById(showList[k]).style.color = 'blue';
    } else {
        document.getElementById(showList[k]).style.color = 'red';
    }
    if (mat[showList[k][0]][showList[k][1]] == '') {
        addNeighbors(showList[k][0], showList[k][1]);
    }
    ++k
    if (k == showList.length) {
        return;
    }
    showElements();
}

function addNeighbors(i, j) {
    for (let k = 0; k < neighbors.length; ++k) {
        if (i + neighbors[k][0] >= 0 && i + neighbors[k][0] < TEN &&
            j + neighbors[k][1] >= 0 && j + neighbors[k][1] < TEN) {
            let distinctive = 1;
            for (let l = 0; l < showList.length; ++l) {
                if (showList[l][0] == i + neighbors[k][0] && showList[l][1] == j + neighbors[k][1]) {
                    distinctive = 0;
                }
            }
            if (distinctive && mat[i + neighbors[k][0]][j + neighbors[k][1]] != '💣') {
                showList.push([i + neighbors[k][0], j + neighbors[k][1]]);
            }
        }
    }
}

function flagMark(id) {
    if (document.getElementById(id).innerHTML == '🚩') {
        document.getElementById(id).innerHTML = '';
        ++bobms;
    } else {
        document.getElementById(id).innerHTML = '🚩';
        --bobms;
    }
    document.getElementById('bombs').innerHTML = bobms + '💣';
}

function statusCheck(element) {
    if (element == '💣') {
        for (let i = 0; i < TEN; ++i) {
            for (let j = 0; j < TEN; ++j) {
                document.getElementById([i, j]).disabled = true;
                document.getElementById([i, j]).innerHTML = mat[i][j];
                if (mat[i][j] == '💣') {
                    document.getElementById([i, j]).innerHTML = '💣';
                }
            }
        }
        document.getElementById("gameConclusion").innerHTML = "💥Game Over!💥";
        clearInterval(countTime);
    } else if (k == 79) {
        document.getElementById("gameConclusion").innerHTML = "🚩You Won!🚩";
        document.getElementById("gameConclusion").style.color = "green";
        clearInterval(countTime);
    }
}
