function generatePipeDataGrid(numPipes, startTs, endTs, stepSec) {
    const pipeData = [];
    const pressureData = {};
    const gridSize = Math.ceil(Math.sqrt(numPipes)); // 取接近正方形的边长
    const stepLng = 0.001; // 经度间隔
    const stepLat = 0.001; // 纬度间隔
    const baseLng = 114.3797;
    const baseLat = 30.5991;

    let id = 1;

    // 按行优先连接点形成线段
    for (let i = 0; i < gridSize && id <= numPipes; i++) {
        for (let j = 0; j < gridSize && id <= numPipes; j++) {
            const current = [baseLng + j * stepLng, baseLat + i * stepLat];

            // 横向连线
            if (j < gridSize && id <= numPipes) {
                const uid = id++;
                const right = [baseLng + (j + 1) * stepLng, baseLat + i * stepLat];
                pipeData.push({
                    id: uid,
                    coordinates: [current, right],
                });
                pressureData[uid] = generatePressure(startTs, endTs, stepSec);
            }

            // 纵向连线
            if (i < gridSize && id <= numPipes) {
                const uid = id++;
                const down = [baseLng + j * stepLng, baseLat + (i + 1) * stepLat];
                pipeData.push({
                    id: uid,
                    coordinates: [current, down],
                });
                pressureData[uid] = generatePressure(startTs, endTs, stepSec);
            }
        }
    }

    return { pipeData, pressureData };
}

// 压力生成函数
function generatePressure(startTs, endTs, stepSec) {
    const FA_length = (endTs + stepSec - startTs) / stepSec;
    const pressure = new Float32Array(FA_length);
    for (let t = 0; t <= FA_length; t++) {
        pressure[t] = Number(Math.random() * 10);
    }
    return pressure;
}

const startTs = 1756137600;
const endTs = 1756224000;
const stepSec = 60;

// 用例
const { pipeData, pressureData } = generatePipeDataGrid(
    // 10,
    20000,
    // 40000,
    startTs, // 开始时间
    endTs, // 结束时间
    stepSec // 时间步长（秒）
);

const DMABounds = [
    [114.3776843498631, 30.595932716842427],
    [114.38686042541309, 30.60321735063998],
];
export { startTs, endTs, stepSec, pipeData, pressureData, DMABounds };
