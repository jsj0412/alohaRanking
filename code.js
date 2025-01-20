//초, 중, 고급반 id
var beginnerUserIdList = ['jsj0412', '0xchaser', 'gggkik', 'mathtw1030', 'sangchoo1201', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];
var intermediateUserIdList = ['jsj0412', 'mathtw1030', 'sangchoo1201'];
var advancedUserIdList = ['jsj0412'];

//초, 중, 고급반 연습문제 리스트
var beginnerProblemIdList = ['1000', '1001', '1002', '1003', '1004', '1005', '1006', '1007', '1008', '1009', '1010'];
var intermediateProblemIdList = ['1000', '1001', '1002', '1003', '1004', '1005', '1006', '1007', '1008', '1009', '1010'];
var advancedProblemIdList = ['1000', '1001', '1002', '1003', '1004', '1005', '1006', '1007', '1008', '1009', '1010'];

const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const targetUrl = 'https://solved.ac/api/v3/search/problem?direction=asc&sort=id';
const url = proxyUrl + targetUrl;

const options = {
    method: 'GET',
    headers: {
        'Origin': 'https://jsj0412.github.io/alohaRanking/',
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json'
    }
};

async function fetchData(queryUserId, queryProblemList) {
    try {
        var queryEnd = 'id%3A' + queryProblemList[0];
        for (var i = 1; i < queryProblemList.length; i++) {
            queryEnd += '%7Cid%3A' + queryProblemList[i];
        }
        const response = await fetch(url + '&query=%40' + queryUserId + '%26%28' + queryEnd + '%29', options);
        const data = await response.json();
        return data['count'];
    } catch (error) {
        console.error(error);
    }
}

function changeRankingDivision(division) {

    createRanking(currentDivision, division);
    currentDivision = division;
    updateRanking(division);
    colorButton(division);
}
async function createRanking(prevDivision, newDivision) {
    const page = document.getElementById('page'); // 부모 컨테이너를 선택

    for (let i = 0; i <= getCurrentUserNum(prevDivision); i++) {
        //div 전부 삭제
        const curDiv = document.getElementById(`container${i}`);
        curDiv.remove();
    }
    for (let i = 0; i <= getCurrentUserNum(newDivision); i++) {
        const newDiv = document.createElement('div'); // 새로운 div 생성
        newDiv.id = `container${i}`; // ID 설정
        page.appendChild(newDiv); // 부모 컨테이너에 추가
        newDiv.className = 'container';

        for (let j = 1; j <= 3; j++) {
            const childDiv = document.createElement('div');
            childDiv.id = `div${i},${j}`;
            newDiv.appendChild(childDiv);
            childDiv.className = `box${j}`;
        }
    }

    document.getElementById('div0,1').textContent = '등수';
    document.getElementById('div0,2').textContent = '아이디';
    document.getElementById('div0,2').className = 'box2_noHover';
    document.getElementById('div0,3').textContent = '푼 연습 문제 수';
}
function getCurrentUserNum(division) {
    if (division == 'beginner') return beginnerUserIdList.length;
    if (division == 'intermediate') return intermediateUserIdList.length;
    return advancedUserIdList.length;
}
var beginnerUserIdRanking = {}, intermediateUserIdRanking = {}, advancedUserIdRanking = {};
//ranking['name'] = 푼 문제 수
async function updateSolvedNum() {
    const beginnerPromises = beginnerUserIdList.map(async (userId) => {
        const numSolved = await fetchData(userId, beginnerProblemIdList);
        return numSolved;
    });
    const intermediatePromises = intermediateUserIdList.map(async (userId) => {
        const numSolved = await fetchData(userId, intermediateProblemIdList);
        return numSolved;
    });
    const advancedPromises = advancedUserIdList.map(async (userId) => {
        const numSolved = await fetchData(userId, advancedProblemIdList);
        return numSolved;
    });


    // 모든 Promise 완료 후 결과 처리
    const beginnerNumSolvedList = await Promise.all(beginnerPromises);
    const intermediateNumSolvedList = await Promise.all(intermediatePromises);
    const advancedNumSolvedList = await Promise.all(advancedPromises);

    for (let i = 0; i < beginnerNumSolvedList.length; i++)
        beginnerUserIdRanking[beginnerUserIdList[i]] = beginnerNumSolvedList[i];
    for (let i = 0; i < intermediateNumSolvedList.length; i++)
        intermediateUserIdRanking[intermediateUserIdList[i]] = intermediateNumSolvedList[i];
    for (let i = 0; i < advancedNumSolvedList.length; i++)
        advancedUserIdRanking[advancedUserIdList[i]] = advancedNumSolvedList[i];

    beginnerUserIdList.sort((a, b) => beginnerUserIdRanking[b] - beginnerUserIdRanking[a]);
    intermediateUserIdList.sort((a, b) => intermediateUserIdRanking[b] - intermediateUserIdRanking[a]);
    advancedUserIdList.sort((a, b) => advancedUserIdRanking[b] - advancedUserIdRanking[a]);
    updateRanking(currentDivision);
}
function updateRanking(currentDivision) {

    // 결과 필터링 및 출력
    let userIdList, userSolvedList;
    if (currentDivision == 'beginner') {
        userIdList = beginnerUserIdList;
        userSolvedList = beginnerUserIdRanking;
    }
    else if (currentDivision == 'intermediate') {
        userIdList = intermediateUserIdList;
        userSolvedList = intermediateUserIdRanking;
    }
    else {
        userIdList = advancedUserIdList;
        userSolvedList = advancedUserIdRanking;
    }
    for (let i = 0; i < userIdList.length; i++) {
        const div1 = document.getElementById(`div${i + 1},${1}`);
        const div2 = document.getElementById(`div${i + 1},${2}`);
        const div3 = document.getElementById(`div${i + 1},${3}`);
        if (div1)
            div1.textContent = (i + 1);
        if (div2) {
            div2.textContent = userIdList[i];
            div2.addEventListener('click', () => {
                window.open('https://www.acmicpc.net/user/' + userIdList[i]);
            });
            div2.style.cursor = 'pointer';

        }
        if (div3)
            div3.textContent = userSolvedList[userIdList[i]];
    }
}

function colorButton(currentDivision) {
    const beginnerButton = document.getElementById('beginnerButton');
    const intermediateButton = document.getElementById('intermediateButton');
    const advancedButton = document.getElementById('advancedButton');

    const currentButton = document.getElementById(`${currentDivision}Button`);
    beginnerButton.style.backgroundColor = 'transparent';
    intermediateButton.style.backgroundColor = 'transparent';
    advancedButton.style.backgroundColor = 'transparent';

    currentButton.style.backgroundColor = '#fbdffb';

}

setInterval(updateSolvedNum, 30000);

