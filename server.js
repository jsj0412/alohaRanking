// server.js

import express from 'express';
import path from 'path';
import fetch from 'node-fetch';
import cors from 'cors';
const app = express();
const PORT = 3000;
app.use(cors());
// JSON 데이터 처리
app.use(express.json());
// 정적 파일 제공 (HTML, CSS, JS 파일 등)
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

//초, 중, 고급반 id
var begUser = ['jsj0412', '0xchaser', 'gggkik', 'mathtw1030', 'sangchoo1201', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];
var intUser = ['jsj0412', 'mathtw1030', 'sangchoo1201'];
var advUser = ['jsj0412'];

//초, 중, 고급반 연습문제 리스트
var begProb = ['1000', '1001', '1002', '1003', '1004', '1005', '1006', '1007', '1008', '1009', '1010'];
var intProb = ['1000', '1001', '1002', '1003', '1004', '1005', '1006', '1007', '1008', '1009', '1010'];
var advProb = ['1000', '1001', '1002', '1003', '1004', '1005', '1006', '1007', '1008', '1009', '1010'];

var begRanking = {}, intRanking = {}, advRanking = {};

const proxyUrl = 'https://jsj0412.github.io/alohaRanking/proxy/';
const targetUrl = 'https://solved.ac/api/v3/search/problem?direction=asc&sort=id';
const url = proxyUrl + targetUrl;

app.all('/proxy/*', async (req, res) => {
    const targetUrl = req.url.replace('/proxy/', '');

    try {
        const response = await fetch(targetUrl, {
            method: req.method,
            headers: req.headers,
            body: req.method === 'POST' || req.method === 'PUT' ? JSON.stringify(req.body) : undefined,
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Request failed', error);
        res.status(500).send('Failed to fetch data from target API');
    }
});


const options = {
    method: 'GET',
    headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    mode: 'cors',
};

async function fetchData(queryUserId, queryProblemList) {
    try {
        let ret = 0;
        let size = 20;
        let queryEnd = '';
        for (var i = 0; i < queryProblemList.length; i++) {
            if (i % size == 0)
                queryEnd = 'id%3A' + queryProblemList[i];
            else if (i % size == size - 1) {
                const response = await fetch(url + '&query=%40' + queryUserId + '%26%28' + queryEnd + '%29', options);
                const data = await response.json();
                ret += data['count'];
            }
            else
                queryEnd += '%7Cid%3A' + queryProblemList[i];
        }
        return ret;
    } catch (error) {
        console.error(error);
    }
}
async function update() {
    console.log('query sent.');
    const begPromises = begUser.map(async (userId) => {
        const numSolved = await fetchData(userId, begProb);
        return numSolved;
    });
    const intPromises = intUser.map(async (userId) => {
        const numSolved = await fetchData(userId, intProb);
        return numSolved;
    });
    const advPromises = advUser.map(async (userId) => {
        const numSolved = await fetchData(userId, advProb);
        return numSolved;
    });

    // 모든 Promise 완료 후 결과 처리
    const begNumSolved = await Promise.all(begPromises);
    const intNumSolved = await Promise.all(intPromises);
    const advNumSolved = await Promise.all(advPromises);

    for (let i = 0; i < begNumSolved.length; i++)
        begRanking[begUser[i]] = begNumSolved[i];
    for (let i = 0; i < intNumSolved.length; i++)
        intRanking[intUser[i]] = intNumSolved[i];
    for (let i = 0; i < advNumSolved.length; i++)
        advRanking[advUser[i]] = advNumSolved[i];
    begUser.sort((a, b) => begRanking[b] - begRanking[a]);
    intUser.sort((a, b) => intRanking[b] - intRanking[a]);
    advUser.sort((a, b) => advRanking[b] - advRanking[a]);
}
app.get('/api/data', (req, res) => {
    res.json({
        'begUser': JSON.stringify(begUser),
        'intUser': JSON.stringify(intUser),
        'advUser': JSON.stringify(advUser),
        'begRanking': JSON.stringify(begRanking),
        'intRanking': JSON.stringify(intRanking),
        'advRanking': JSON.stringify(advRanking)
    });
});

// 서버 실행
update();
//10분마다 solved.ac에 쿼리
setInterval(update, 600000)

app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});


