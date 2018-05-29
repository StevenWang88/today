/**
 * 参数不明白的地方参照WIKI
 *
 * http://wiki.uletm.com/pages/viewpage.action?pageId=29508261
 * */

export default [
	{
		url : '/vpsShopSaleService/jxc/searchSaleOrderSummaryCountForPad!searchSaleOrderSummaryCountForPad.do'
		,name : 'searchSaleOrderSummaryCountForPad'
		//,des : 'pad 销售统计汇总接口，按日期查询'
	},
	{
		url : '/vpsShopSaleService/jxc/saleOrderStatistic/syscGetSaleOrderStatisticForPad!syscGetSaleOrderStatisticForPad.do'
		,name : 'syscGetSaleOrderStatisticForPad'
		//,des : 'pad 销售统计汇总接口，今日，昨日，上月，本月'
	},
	{
		url : '/vpsShopSaleService/jxc/searchSaleOrderSummaryForPad!searchSaleOrderSummaryForPad.do',
		name : 'searchSaleOrderSummaryForPad',
		//,des : 'pad 销售订单明细'
	},
	{
		url : '/vpsShopSaleService/jxc/searchSaleSumQiriChangeForPad!searchSaleSumQiriChangeForPad.do',
		name : 'searchSaleSumQiriChangeForPad',
		//,des : ' pad版销售流水 近七日 销售统计汇总变化接口'
	},
	{
		url : '/vpsShopSaleService/jxc/searchSaleOrderForPad!searchSaleOrderForPad.do',
		name : 'searchSaleOrderForPad',
		//,des : ' 单个订单明细流水'
	},
	{
		url : '/vpsShopSaleService/jxc/padToReturnAll!padToReturnAll.do',
		name : 'padToReturnAll',
		//订单列表整单退货接口
	},
	{
		url : '/vpsShopSaleService/jxc/padToReturn!padToReturn.do',
		name : 'padToReturn',
		//订单列表单件退货验证接口
	},
	{
		url : '/vpsShopSaleService/jxc/padToReturnOne!padToReturnOne.do',
		name : 'padToReturnOne',
		//订单列表单件退货接口
	},
	{
		url: '/vpsShopSaleService/jxc/padDoSaleReturn!padDoSaleReturn.do',
		name: 'padDoSaleReturn',
		//订单退货确认接口
	},
	{
		url : '/vpsShopSaleService/jxc/searchSaleOrderItemForPad!searchSaleOrderItemForPad.do',
		name : 'searchSaleOrderItemForPad',
		//des : pad 销售统计 按商品统计接口
	},
	{
		url : '/vpsItemService/itemService/pad/itemList',
		name : 'itemList',
		//des : 商品查询接口
	},
	{
		url : '/vpsItemService/itemService/pad/itemTypeList',
		name : 'itemTypeList',
		//des : 2商品类型查询接口
	},
	{
		url : '/vpsItemService/itemService/pad/updateItem',
		name : 'updateItem',
		//des : 商品更新接口
	},
	{
		url:'/vpsItemService/itemService/pad/addItem',
		name:'addItem',
		//des:新增商品接口
	},
	{
		url:'/vpsItemService/itemService/pad/getItemQtyHenList',
		name:'getItemQtyHenList',
		//des:商品批次接口
	},
	{
		url:"/vpsItemService/itemService/pad/itemAdjust",
		name:'itemAdjust',
		//des:盘库调整接口
	},
	{
		url:'/vpsItemService/itemService/pad/addItemType',
		name:"addItemType",
		//des:商品分类新增
	},
	{
		url:'/vpsItemService/itemService/pad/updataItemType',
		name:'updataItemType',
		//des:商品分类修改
	},
	{
		url:'/vpsItemService/itemService/pad/updataItemQty',
		name:'updataItemQty'
		//修改批次库存
	},
	{
		url:"/vpsItemService/itemService/pad/addItemQtyHen",
		name:'addItemQtyHen',
		//新增批次入库
	},
	{
		url:"/vpsItemService/itemService/pad/addItemExpiration",
		name:"addItemExpiration",
		//更新库存商品的生产日期和保质期
	},
	{
		url:'/vpsItemService/itemService/pad/queryItem',
		name:"queryItem",
		//商品详情
	},
	{
		url:'/vpsShopSaleService/jxc/searchCustomerInfo!searchCustomerInfo.do',
		name:"searchCustomerInfo",
		//会员信息
	}
]
