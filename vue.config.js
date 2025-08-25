const path = require("path");
const { defineConfig } = require("@vue/cli-service");

// function resolve(dir) {
//     return path.join(__dirname, dir);
// }

module.exports = defineConfig({
    transpileDependencies: true,
    lintOnSave: false,
    configureWebpack: {
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "src"),
                "@views": path.resolve(__dirname, "src/views"),
                "@config": path.resolve(__dirname, "src/config"),
                "@cmp": path.resolve(__dirname, "src/components"),
            },
        },
    },
    devServer: {
        proxy: {
            "/gis-ae": {
                target: "https://140.246.183.164:8000",
                changeOrigin: true,
                secure: false,
            },
            "/subscribe-api": {
                target: "https://subscribe.ai.com",
                changeOrigin: true,
                secure: false, // 如果目标是 https，可能需要设置这个
                pathRewrite: {
                    "^/subscribe-api": "",
                },
            },
            "/get-waterQuality": {
                target: "https://szzdjc.cnemc.cn:8070/GJZ/Ajax/Publish.ashx",
                changeOrigin: true,
                secure: false, // 如果目标是 https，可能需要设置这个
                pathRewrite: {
                    "^/subscribe-api": "",
                },
            },
        },
    },
});
