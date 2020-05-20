export default {
    /* -------- 位置相关 Location Controller -------- */
    listLocationUsingGet: { // 列出下辖地区
        method: 'get',
        url: `/api/v1/location/locations` 
    }, 
    listParentUsingGet: { // 获取上级地区
        method: 'get',
        url: `/api/v1/location/parent` 
    }, 

    /* -------- 商品相关 Item Controller -------- */
    listItemDetailUsingGet: { // 列出产品的详细
        method: 'get',
        url: `/api/v1/item/details` 
    }, 
    listItemUsingGet: { // 列出种类的产品
        method: 'get',
        url: `/api/v1/item/items` 
    }, 
    listSizeUsingGet: { // 列出大小
        method: 'get',
        url: `/api/v1/item/sizes` 
    }, 
    listTypeUsingGet: { // 列出种类
        method: 'get',
        url: `/api/v1/item/types` 
    }, 
    queryItemDetailUsingGet: { // 查询商品的详细
        method: 'get',
        url: `/api/v1/items/query-detail` 
    }, 
    itemTypeDetailUsingGet: { // 列出某一类商品的详细
        method: 'get',
        url: `/api/v1/items/type-detail` 
    }, 

    /* -------- 店铺相关 Store Controller -------- */
    listStoresUsingGet: { // 根据地理位置获取店铺
        method: 'get',
        url: `/api/v1/store/stores` 
    }, 
    delStoreUsingGet: { // 删除店铺
        method: 'get',
        url: `/api/v1/store/del-store` 
    }, 
    listStoresUsingPost: { // 列出区县的所有店铺
        method: 'post',
        url: `/api/v1/store/list-stores` 
    }, 
    listStoresByAreaUsingPost: { // 列出大区的所有店铺
        method: 'post',
        url: `/api/v1/store/list-stores-by-area` 
    }, 
    listStoresByCityUsingPost: { // 列出城市的所有店铺
        method: 'post',
        url: `/api/v1/store/list-stores-by-city` 
    }, 
    listStoresByDistUsingPost: { // 列出区县的所有店铺
        method: 'post',
        url: `/api/v1/store/list-stores-by-district` 
    }, 
    listStoresByProvUsingPost: { // 列出省份的所有店铺
        method: 'post',
        url: `/api/v1/store/list-stores-by-prov` 
    }, 
    searchStoresUsingPost: { // 搜索店铺
        method: 'post',
        url: `/api/v1/store/search-stores` 
    }, 
    updStoreUsingPost: { // 更新店铺
        method: 'post',
        url: `/api/v1/store/update-store` 
    }, 

    /* -------- 数据相关 Data Controller -------- */
    displayLocationSaleCountUsingGet: { // 数据
        method: 'get',
        url: `/api/v1/data/sales` 
    }, 

}