const layerRequests = [
    {
        name: "兴趣点_医院（基础库数据）",
        url: "/restapi/prod/IC50000020231020000058/proxy/http/RES_YYSJ_TL92/20c62024673e45c99fbdf7d0c0b54c59/77",
        accessKey: "BCDSGA_feb9c587bfc69ee80af732e027371eff",
        secretKey: "BCDSGS_a102d8545c7e6f2c5504d5c4f12e6011",
    },
    {
        name: "三维框架模型-建筑-接口",
        url: "/restapi/prod/IC50000020250807000001/xdata/tbl/api/execute/b240dbe8-1b4c-40ea-a026-48fb34b4ae37",
        accessKey: "BCDSGA_fe79f7c8c933a818d9fc244f543ea749",
        secretKey: "BCDSGS_ac5b6e1eeaea0a4ef1ea28c8515837b9",
    },
    {
        name: "地理框架_实景二级图",
        url: "/restapi/prod/IC50000020250328000147/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/61b453fa-7fcc-493e-a9ae-8c974b55be57/rest/services/Hosted/481fd1cd-4871-46c3-bb50-69eb9dcd28a9/SceneServer",
        accessKey: "BCDSGA_af06865e276e1c340d60c8211e8b9797",
        secretKey: "BCDSGS_4a9bee1e4355c0302a08d76640d2df21",
    },
    {
        name: "室内结构三级图",
        url: "/restapi/prod/IC50000020240322000053/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/150e1295-67bd-4273-bb37-011dae6a9e83/93e34a07-7f36-4985-a2c8-0b1be4fa8b75/MapServer",
        accessKey: "BCDSGA_47a193c6dd825a2d9bde9e83224f013b",
        secretKey: "BCDSGS_0cbd079dff675b7edfc7089f300f0eb5",
    },
    {
        name: "重庆影像图",
        url: "/restapi/prod/IC50000020231025000014/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/f7c5e788-24d0-40ef-ac23-9cfd0ee4d751/937dafc7-f4cb-4dd8-bdf6-4a5d58e0ce94/MapServer",
        accessKey: "BCDSGA_73692d5ce503eb481f3a71d75f92b3bf",
        secretKey: "BCDSGS_be39a8c881689c03683c77ca3907e590",
    },
    {
        name: "晕渲一级图",
        url: "/restapi/prod/IC50000020250328000116/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/4101c65f-649a-4278-bcf9-5418d687f3e4/B655A3C8-94E4-11B2-BFC0-CC72605A1D26/wms",
        accessKey: "BCDSGA_d42b1ebc51bffd25b6bbdebfba79016f",
        secretKey: "BCDSGS_5586cfc5ac9e2ea559e897136b2fb309",
    },
    {
        name: "影像一级图_2024年",
        url: "/restapi/prod/IC50000020250328000112/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/eb6c1660-3a23-4448-993b-d98c92f66099/B634A3C8-94E4-11B2-B64D-3302892039B4/wms",
        accessKey: "BCDSGA_28a40810b501edef832a5862bbb9868b",
        secretKey: "BCDSGS_1407c60bd1b423cb16f969539236d593",
    },
    {
        name: "矢量一级图",
        url: "/restapi/prod/IC50000020250328000118/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/53449f28-dcbb-4e33-ba66-631c47868e5f/B645A3C8-94E4-11B2-B8A6-A52BA21D6E48/MapServer",
        accessKey: "BCDSGA_38e8e9835ca3792818bfc565cdda467e",
        secretKey: "BCDSGS_d93ce29dbb673d36f2447a54b55e9939",
    },
    {
        name: "重庆市矢量图_暗色版",
        url: "/restapi/prod/IC50000020240625000001/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/6beb48dc-586b-4711-b08c-b68e7d0a99ef/825e600f-9009-4165-9170-07e4ba30f778/MapServer",
        accessKey: "BCDSGA_58d1802c3ad3edc3ef664d6a34b15080",
        secretKey: "BCDSGS_41811135cdce7b6b936547e56003e721",
    },
    {
        name: "重庆市矢量图_深色版",
        url: "/restapi/prod/IC50000020231025000016/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/d5079a46-3647-45c6-8e5b-07365d4f2d2b/1ce200f8-7d51-475b-9c87-312356a675c7/MapServer",
        accessKey: "BCDSGA_c5db65c1e4d395d6a74c183958b96d38",
        secretKey: "BCDSGS_b9cca5bef60b6f71cdb8f78b9ba0372a",
    },
    {
        name: "重庆影像图注记",
        url: "/restapi/prod/IC50000020231025000004/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/7e5b8ce5-57bd-498b-a6a3-0e1f1791ee35/2903f2b9-a764-40b6-be55-782fef3ad4ab/MapServer",
        accessKey: "BCDSGA_38e8e9835ca3792818bfc565cdda467e",
        secretKey: "BCDSGS_d93ce29dbb673d36f2447a54b55e9939",
    },
    {
        name: "重庆市矢量图_常规版",
        url: "/restapi/prod/IC50000020231025000002/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/3fcf237a-7e46-44e4-a028-c01aa95bcb5f/f7839307-ea4c-4ee8-a757-7ae37d2face9/MapServer",
        accessKey: "BCDSGA_e6546f3bd12ae992122af7b3ab8e0b50",
        secretKey: "BCDSGS_3bcd33755a28a4f54cee1aeeb03408c6",
    },
    {
        name: "城市道路（基础库数据）",
        url: "/restapi/prod/IC50000020231020000061/proxy/http/RES_CSDLSJ_HL6F/cb97258f14544ee1978d7138e085cc76/56",
        accessKey: "BCDSGA_ce5ab38ce1dca623b16603ce4d554118",
        secretKey: "BCDSGS_45b46372663af58c8ee6ceb4a71c033b",
    },
    {
        name: "二级图_实景纹理公用设施建筑",
        url: "/restapi/prod/IC50000020250328000147/multApp/datamanager/service/781a74aa-d91c-446f-9e46-38cd0407751f/61b453fa-7fcc-493e-a9ae-8c974b55be57/rest/services/Hosted/481fd1cd-4871-46c3-bb50-69eb9dcd28a9/SceneServer",
        accessKey: "BCDSGA_71660d40d092ed04a5d97e1db32fae23",
        secretKey: "BCDSGS_2b5b3a0ca063935135fa8b29730fa1ac",
    },
];

export { layerRequests };
