function generatePipeDataGrid(numPipes, startTs, endTs, stepSec) {
    const pipeData = [];
    const gridSize = Math.ceil(Math.sqrt(numPipes)); // 取接近正方形的边长
    const stepLng = 0.001; // 经度间隔
    const stepLat = 0.001; // 纬度间隔
    const baseLng = 114.3797;
    const baseLat = 30.5991;

    let id = 1;

    // 生成网格点
    const points = [];
    for (let i = 0; i <= gridSize; i++) {
        for (let j = 0; j <= gridSize; j++) {
            points.push([baseLng + j * stepLng, baseLat + i * stepLat]);
        }
    }

    // 按行优先连接点形成线段
    for (let i = 0; i < gridSize && id <= numPipes; i++) {
        for (let j = 0; j < gridSize && id <= numPipes; j++) {
            const current = [baseLng + j * stepLng, baseLat + i * stepLat];

            // 横向连线
            if (j < gridSize && id <= numPipes) {
                const right = [baseLng + (j + 1) * stepLng, baseLat + i * stepLat];
                pipeData.push({
                    id: `pipe-${id++}`,
                    coordinates: [current, right],
                    pressure: generatePressure(startTs, endTs, stepSec),
                });
            }

            // 纵向连线
            if (i < gridSize && id <= numPipes) {
                const down = [baseLng + j * stepLng, baseLat + (i + 1) * stepLat];
                pipeData.push({
                    id: `pipe-${id++}`,
                    coordinates: [current, down],
                    pressure: generatePressure(startTs, endTs, stepSec),
                });
            }
        }
    }

    return pipeData;
}

// 压力生成函数
function generatePressure(startTs, endTs, stepSec) {
    const pressure = {};
    for (let t = startTs; t <= endTs; t += stepSec) {
        pressure[t] = Number(Math.random().toFixed(2));
    }
    return pressure;
}

// 用例
const pipeData = generatePipeDataGrid(
    10000,
    1756166400, // 开始时间
    1756209600, // 结束时间
    60 // 时间步长（秒）
);

// const pipeData = [
//     {
//         id: "pipe-1",
//         coordinates: [
//             [114.379708025519, 30.59914088226904],
//             [114.3800160570047, 30.59927345290437],
//         ],
//         pressure: {
//             1756166400: 0.1,
//             1756166460: 0.5,
//             1756166520: 0.9,
//         },
//     },
//     {
//         id: "pipe-2",
//         coordinates: [
//             [114.3800160570047, 30.59927345290437],
//             [114.38033949006456, 30.59939939483968],
//         ],
//         pressure: {
//             1756166400: 0.1,
//             1756166460: 0.5,
//             1756166520: 0.9,
//         },
//     },
//     {
//         id: "pipe-3",
//         coordinates: [
//             [114.38033949006456, 30.59939939483968],
//             [114.38073993099545, 30.599558479155718],
//         ],
//         pressure: {
//             1756166400: 0.1,
//             1756166460: 0.5,
//             1756166520: 0.9,
//         },
//     },
// ];

const DMABounds = [
    [114.3776843498631, 30.595932716842427],
    [114.38686042541309, 30.60321735063998],
];
export { pipeData, DMABounds };
