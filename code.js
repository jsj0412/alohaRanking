var currentDivision = 'beginner';
var currentNum = {
    'beginner': 0,
    'intermediate': 0,
    'advanced': 0
}
var currentList = {
    'beginner': [],
    'intermediate': [],
    'advanced': []
}
var currentRanking = {
    'beginner': {},
    'intermediate': {},
    'advanced': {}
}
function changeRankingDivision(division) {

    createRanking(currentDivision, division);
    currentDivision = division;
    updateRanking(division);
    colorButton(division);
}

function createRanking(prevDivision, newDivision) {
    const page = document.getElementById('page'); // 부모 컨테이너를 선택
    const prevUserNum = currentNum[prevDivision];
    const newUserNum = currentNum[newDivision];
    for (let i = 0; i <= prevUserNum; i++) {
        //div 전부 삭제
        const curDiv = document.getElementById(`container${i}`);
        curDiv.remove();
    }
    for (let i = 0; i <= newUserNum; i++) {
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
function updateRanking(currentDivision) {

    // 결과 필터링 및 출력
    let userIdList = currentList[currentDivision];
    let userSolvedList = currentRanking[currentDivision];
    for (let i = 0; i < userIdList.length; i++) {
        const div1 = document.getElementById(`div${i + 1},1`);
        const div2 = document.getElementById(`div${i + 1},2`);
        const div3 = document.getElementById(`div${i + 1},3`);
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

async function getData() {
    const response = await fetch('http://jsj0412.github.io/alohaRanking/api/data', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();

    currentList['beginner'] = JSON.parse(data['begUser']);
    currentList['intermediate'] = JSON.parse(data['intUser']);
    currentList['advanced'] = JSON.parse(data['advUser']);
    currentRanking['beginner'] = JSON.parse(data['begRanking']);
    currentRanking['intermediate'] = JSON.parse(data['intRanking']);
    currentRanking['advanced'] = JSON.parse(data['advRanking']);
    currentNum['beginner'] = currentList['beginner'].length;
    currentNum['intermediate'] = currentList['intermediate'].length;
    currentNum['advanced'] = currentList['advanced'].length;
    console.log(currentRanking);
    updateRanking('beginner');
    updateRanking('intermediate');
    updateRanking('advanced');
}

//2분마다 솔브 수 업데이트
setInterval(getData, 120000);