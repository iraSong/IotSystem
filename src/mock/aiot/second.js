// 二期接口

import Mock from './index.js'
import qs from 'query-string'

Mock.setup({
  timeout: 300, // 设置延迟响应，模拟向后端请求数据
})

// 各城市/社区工单数量
const orderInfo = {
	"code":200,
	"data":{
		"orderInfo":[
			{
				"id":"212",
				"name":"深圳市",
				"statusList":[
					{
						"count":9,
						"status":"1"
					},
					{
						"count":1,
						"status":"4"
					}
				],
				"total":10
			},
			{
				"id":"1",
				"name":"北京市",
				"statusList":[
					{
						"count":3,
						"status":"4"
					},
					{
						"count":18,
						"status":"1"
					},
					{
						"count":1,
						"status":"2"
					}
				],
				"total":22
			}
		],
		"result":"1001"
	},
	"msg":"执行成功"
}
// 获取工单记录列表
const orderRecord = {
	"code":200,
	"data":{
		"orderRecordList":[
			{
				"businessId":"5dfcb938e4b07fb2f4fc4c6e",
				"businessType":"4",
				"cityCode":"1",
				"cityName":"北京市",
				"crmOrderId":"1210024272635654144",
				"deviceType":"",
				"id":"89076418583261184",
				"informTime":1577327242000,
				"orderLvl":"low",
				"orderMemo":"fsdfsdfdsf",
				"orderStatus":"1",
				"projectId":"b20391f895a04db88af9cf2515e87864",
				"projectName":"千丁花园",
				"provinceCode":"1",
				"provinceName":"北京市",
				"tenantId":"T001"
			},
			{
				"businessId":"5dfcb938e4b07fb2f4fc4c6e",
				"businessType":"4",
				"cityCode":"1",
				"cityName":"北京市",
				"crmOrderId":"1210014634186649600",
				"deviceType":"",
				"id":"89066780924112896",
				"informTime":1577324944000,
				"orderLvl":"low",
				"orderMemo":"不一样的",
				"orderStatus":"4",
				"projectId":"b20391f895a04db88af9cf2515e87864",
				"projectName":"千丁花园",
				"provinceCode":"1",
				"provinceName":"北京市",
				"tenantId":"T001"
			},
			{
				"businessId":"5dfcb938e4b07fb2f4fc4c6e",
				"businessType":"4",
				"cityCode":"1",
				"cityName":"北京市",
				"crmOrderId":"1210011611641163776",
				"deviceType":"",
				"id":"89063758475096064",
				"informTime":1577324223000,
				"orderLvl":"low",
				"orderMemo":"好人啊",
				"orderStatus":"4",
				"projectId":"b20391f895a04db88af9cf2515e87864",
				"projectName":"千丁花园",
				"provinceCode":"1",
				"provinceName":"北京市",
				"tenantId":"T001"
			},
			{
				"businessId":"5dfcb926e4b07fb2f4fc4c6b",
				"businessType":"4",
				"cityCode":"1",
				"cityName":"北京市",
				"crmOrderId":"1210010533629538304",
				"deviceType":"",
				"id":"89062680400556032",
				"informTime":1577323966000,
				"orderLvl":"low",
				"orderMemo":"测试数据",
				"orderStatus":"4",
				"projectId":"b20391f895a04db88af9cf2515e87864",
				"projectName":"千丁花园",
				"provinceCode":"1",
				"provinceName":"北京市",
				"tenantId":"T001"
			},
			{
				"businessId":"5dfcb938e4b07fb2f4fc4c6e",
				"businessType":"4",
				"cityCode":"1",
				"cityName":"北京市",
				"crmOrderId":"1209811324221534208",
				"deviceType":"",
				"id":"88863471059660800",
				"informTime":1577276471000,
				"orderLvl":"low",
				"orderMemo":"vvvvZxzXa",
				"orderStatus":"1",
				"projectId":"b20391f895a04db88af9cf2515e87864",
				"projectName":"千丁花园",
				"provinceCode":"1",
				"provinceName":"北京市",
				"tenantId":"T001"
			},
			{
				"businessId":"5dfcb938e4b07fb2f4fc4c6e",
				"businessType":"4",
				"cityCode":"1",
				"cityName":"北京市",
				"crmOrderId":"1209810180367724544",
				"deviceType":"",
				"id":"88862327172296704",
				"informTime":1577276198000,
				"orderLvl":"low",
				"orderMemo":"vvvvZxzXa",
				"orderStatus":"1",
				"projectId":"b20391f895a04db88af9cf2515e87864",
				"projectName":"千丁花园",
				"provinceCode":"1",
				"provinceName":"北京市",
				"tenantId":"T001"
			},
			{
				"businessId":"5dfcb938e4b07fb2f4fc4c6e",
				"businessType":"4",
				"cityCode":"1",
				"cityName":"北京市",
				"crmOrderId":"1209809953447489536",
				"deviceType":"",
				"id":"88862100218507264",
				"informTime":1577276144000,
				"orderLvl":"low",
				"orderMemo":"vvvvZxzXa",
				"orderStatus":"1",
				"projectId":"b20391f895a04db88af9cf2515e87864",
				"projectName":"千丁花园",
				"provinceCode":"1",
				"provinceName":"北京市",
				"tenantId":"T001"
			},
			{
				"businessId":"5dfcb938e4b07fb2f4fc4c6e",
				"businessType":"4",
				"cityCode":"1",
				"cityName":"北京市",
				"crmOrderId":"1209809757799985152",
				"deviceType":"",
				"id":"88861904512282624",
				"informTime":1577276097000,
				"orderLvl":"low",
				"orderMemo":"vvvvZxzXa",
				"orderStatus":"1",
				"projectId":"b20391f895a04db88af9cf2515e87864",
				"projectName":"千丁花园",
				"provinceCode":"1",
				"provinceName":"北京市",
				"tenantId":"T001"
			},
			{
				"businessId":"5df37ddbe4b0290a1afcd06f",
				"businessType":"4",
				"cityCode":"1",
				"cityName":"北京市",
				"crmOrderId":"1209809513305616384",
				"deviceType":"",
				"id":"88861660017913856",
				"informTime":1577276039000,
				"orderLvl":"low",
				"orderMemo":"cxc",
				"orderStatus":"1",
				"projectId":"b20391f895a04db88af9cf2515e87864",
				"projectName":"千丁花园",
				"provinceCode":"1",
				"provinceName":"北京市",
				"tenantId":"T001"
			},
			{
				"businessId":"5dfcb938e4b07fb2f4fc4c6e",
				"businessType":"4",
				"cityCode":"1",
				"cityName":"北京市",
				"crmOrderId":"1209809470121062400",
				"deviceType":"",
				"id":"88861616875302912",
				"informTime":1577276029000,
				"orderLvl":"low",
				"orderMemo":"vvvvZxzXa",
				"orderStatus":"1",
				"projectId":"b20391f895a04db88af9cf2515e87864",
				"projectName":"千丁花园",
				"provinceCode":"1",
				"provinceName":"北京市",
				"tenantId":"T001"
			}
		],
		"pageNo":1,
		"pageSize":10,
		"result":"1001",
		"totalCnt":22
	},
	"msg":"执行成功"
}

// 更多弹框，当日工单数量统计
const orderStatistic = {
	"code":200,
	"data":{
		"orderStatusList":[
			{
				"status":"1",
        "timeStatisticTimeList": [
          {
            "orderCount": 12,
            "time": 2019-19-10,
          },
          {
            "orderCount": 20,
            "time": 2019-19-11,
          },
          {
            "orderCount": 25,
            "time": 2019-19-12,
          }
        ],
      },
			{
				"status":"4",
        "timeStatisticTimeList": [
          {
            "orderCount": 30,
            "time": 2019-19-10,
          },
          {
            "orderCount": 20,
            "time": 2019-19-11,
          },
          {
            "orderCount": 15,
            "time": 2019-19-12,
          }
        ],
      },
    ],
		"result":"1001"
	},
	"msg":"执行成功"
}
// 更多弹框，当日工单数量统计
// 告警类型
const orderTypeStatistic = {
	"code":200,
	"data":{
		"orderStatistic":[
			{
				"businessName":"类型11",
				"businessType":"4",
				"orderCount":19
      },
			{
				"businessName":"类型22",
				"businessType":"1",
				"orderCount":19
			},
			{
				"businessName":"类型33",
				"businessType":"1",
				"orderCount":19
			}
		],
		"result":"1001"
	},
	"msg":"执行成功"
}
// 紧急程度
const orderTypeStatistic2 = {
	"code":200,
	"data":{
		"orderStatistic":[
			{
				"businessName":"类型1",
				"businessType":"4",
				"orderCount":19
      },
			{
				"businessName":"类型2",
				"businessType":"1",
				"orderCount":19
			},
			{
				"businessName":"类型2",
				"businessType":"1",
				"orderCount":19
			}
		],
		"result":"1001"
	},
	"msg":"执行成功"
}

// 各城市/社区工单数量
const orderDetail = {
	"code":200,
	"data":{
		"orderInfo":{
			"orderDetail":[
				{
					"step":"工单生成",
					"time":"2019-12-26 10:27:22"
				},
				{
					"step":"待分派",
					"time":"2019-12-26 10:45:52"
				},
				{
					"step":"已响应",
					"time":"2019-12-26 10:45:52"
				}
			],
			"orderInfo":{
				"orderDesc":"fsdfsdfdsf",
				"orderType":"工程类"
			}
		},
		"result":"1001"
	},
	"msg":"执行成功"
}
// 置顶
const topData = {
	"code": 200,
	"data": {
		"result": "1000 执行失败 1001 执行成功 9000003 置顶设备达限"
	},
	"msg": "执行成功"
}
// 单元
const unitData = {
	"code":200,
	"data":{
		"list":[
			{
				"id":"b7eb03f3b5ab463bb4d4286fb0c8e957",
				"innerId":39741,
				"name":"2",
				"roomNum":"10"
			}
		],
		"result":""
	},
	"msg":"查询成功"
}
// 房间
const roomData = {
	"code":200,
	"data":{
		"list":[
			{
				"appUserList":[],
				"aptmUuid":"",
				"buildName":"2栋",
				"buildNo":"",
				"buildingId":"2bf369312a0146e6965c9684c25c1ab8",
				"cityCode":"118",
				"cityName":"合肥市",
				"groupId":"0470aae2dd4349858337293e4455ad0f",
				"groupName":"1组团",
				"groupNo":"",
				"id":"02718796b39446eaa40a16ecfc3946b8",
				"liveCount":0,
				"liveStatus":"",
				"name":"2001",
				"originalName":"",
				"outerRoomId":"666fa33aa1e541de827096faa547dfd4",
				"outerUnitId":"2",
				"projectId":"e9975f291c72464f9b0cb612fa1f4e19",
				"projectName":"祥源测试社区1",
				"provinceCode":"12",
				"provinceName":"安徽省",
				"roomCode":"",
				"roomNo":"",
				"tenantId":"T025",
				"unitId":"b7eb03f3b5ab463bb4d4286fb0c8e957",
				"unitNo":""
			},
			{
				"appUserList":[],
				"aptmUuid":"",
				"buildName":"2栋",
				"buildNo":"",
				"buildingId":"2bf369312a0146e6965c9684c25c1ab8",
				"cityCode":"118",
				"cityName":"合肥市",
				"groupId":"0470aae2dd4349858337293e4455ad0f",
				"groupName":"1组团",
				"groupNo":"",
				"id":"ce4b39d3ba484b09a7ef95fb3d037775",
				"liveCount":0,
				"liveStatus":"",
				"name":"2005",
				"originalName":"",
				"outerRoomId":"b7fedbe8b3354263b8fea077534c8bbc",
				"outerUnitId":"2",
				"projectId":"e9975f291c72464f9b0cb612fa1f4e19",
				"projectName":"祥源测试社区1",
				"provinceCode":"12",
				"provinceName":"安徽省",
				"roomCode":"",
				"roomNo":"",
				"tenantId":"T025",
				"unitId":"b7eb03f3b5ab463bb4d4286fb0c8e957",
				"unitNo":""
			},
			{
				"appUserList":[],
				"aptmUuid":"",
				"buildName":"2栋",
				"buildNo":"",
				"buildingId":"2bf369312a0146e6965c9684c25c1ab8",
				"cityCode":"118",
				"cityName":"合肥市",
				"groupId":"0470aae2dd4349858337293e4455ad0f",
				"groupName":"1组团",
				"groupNo":"",
				"id":"5e6d430312a647ba9d9f24bc5fb49c35",
				"liveCount":0,
				"liveStatus":"",
				"name":"2006",
				"originalName":"",
				"outerRoomId":"060462a1edd74ef5894490da9dcd67ae",
				"outerUnitId":"2",
				"projectId":"e9975f291c72464f9b0cb612fa1f4e19",
				"projectName":"祥源测试社区1",
				"provinceCode":"12",
				"provinceName":"安徽省",
				"roomCode":"",
				"roomNo":"",
				"tenantId":"T025",
				"unitId":"b7eb03f3b5ab463bb4d4286fb0c8e957",
				"unitNo":""
			},
			{
				"appUserList":[],
				"aptmUuid":"",
				"buildName":"2栋",
				"buildNo":"",
				"buildingId":"2bf369312a0146e6965c9684c25c1ab8",
				"cityCode":"118",
				"cityName":"合肥市",
				"groupId":"0470aae2dd4349858337293e4455ad0f",
				"groupName":"1组团",
				"groupNo":"",
				"id":"50fb959147d84c498e2bb057bea84450",
				"liveCount":0,
				"liveStatus":"",
				"name":"2007",
				"originalName":"",
				"outerRoomId":"4cb2024b4bcb4b8497b695dbc26afb95",
				"outerUnitId":"2",
				"projectId":"e9975f291c72464f9b0cb612fa1f4e19",
				"projectName":"祥源测试社区1",
				"provinceCode":"12",
				"provinceName":"安徽省",
				"roomCode":"",
				"roomNo":"",
				"tenantId":"T025",
				"unitId":"b7eb03f3b5ab463bb4d4286fb0c8e957",
				"unitNo":""
			},
			{
				"appUserList":[],
				"aptmUuid":"",
				"buildName":"2栋",
				"buildNo":"",
				"buildingId":"2bf369312a0146e6965c9684c25c1ab8",
				"cityCode":"118",
				"cityName":"合肥市",
				"groupId":"0470aae2dd4349858337293e4455ad0f",
				"groupName":"1组团",
				"groupNo":"",
				"id":"89e8eebf181f446ab2a0db7a1fa5dc9a",
				"liveCount":0,
				"liveStatus":"",
				"name":"2008",
				"originalName":"",
				"outerRoomId":"7cae9ce915ba4399b2092b34bbac16c2",
				"outerUnitId":"2",
				"projectId":"e9975f291c72464f9b0cb612fa1f4e19",
				"projectName":"祥源测试社区1",
				"provinceCode":"12",
				"provinceName":"安徽省",
				"roomCode":"",
				"roomNo":"",
				"tenantId":"T025",
				"unitId":"b7eb03f3b5ab463bb4d4286fb0c8e957",
				"unitNo":""
			},
			{
				"appUserList":[],
				"aptmUuid":"",
				"buildName":"2栋",
				"buildNo":"",
				"buildingId":"2bf369312a0146e6965c9684c25c1ab8",
				"cityCode":"118",
				"cityName":"合肥市",
				"groupId":"0470aae2dd4349858337293e4455ad0f",
				"groupName":"1组团",
				"groupNo":"",
				"id":"dfa58027866648f1acde5057a1e9a3db",
				"liveCount":0,
				"liveStatus":"",
				"name":"2011",
				"originalName":"",
				"outerRoomId":"bd7d8d6f13d24302b51ed76d0353e339",
				"outerUnitId":"2",
				"projectId":"e9975f291c72464f9b0cb612fa1f4e19",
				"projectName":"祥源测试社区1",
				"provinceCode":"12",
				"provinceName":"安徽省",
				"roomCode":"",
				"roomNo":"",
				"tenantId":"T025",
				"unitId":"b7eb03f3b5ab463bb4d4286fb0c8e957",
				"unitNo":""
			},
			{
				"appUserList":[],
				"aptmUuid":"",
				"buildName":"2栋",
				"buildNo":"",
				"buildingId":"2bf369312a0146e6965c9684c25c1ab8",
				"cityCode":"118",
				"cityName":"合肥市",
				"groupId":"0470aae2dd4349858337293e4455ad0f",
				"groupName":"1组团",
				"groupNo":"",
				"id":"cd3095413a6046169ac1cfcc3f1f5bb5",
				"liveCount":0,
				"liveStatus":"",
				"name":"2012",
				"originalName":"",
				"outerRoomId":"48b03752460442669c3c0d47cb9a068d",
				"outerUnitId":"2",
				"projectId":"e9975f291c72464f9b0cb612fa1f4e19",
				"projectName":"祥源测试社区1",
				"provinceCode":"12",
				"provinceName":"安徽省",
				"roomCode":"",
				"roomNo":"",
				"tenantId":"T025",
				"unitId":"b7eb03f3b5ab463bb4d4286fb0c8e957",
				"unitNo":""
			},
			{
				"appUserList":[],
				"aptmUuid":"",
				"buildName":"2栋",
				"buildNo":"",
				"buildingId":"2bf369312a0146e6965c9684c25c1ab8",
				"cityCode":"118",
				"cityName":"合肥市",
				"groupId":"0470aae2dd4349858337293e4455ad0f",
				"groupName":"1组团",
				"groupNo":"",
				"id":"8b0cf272115144619d0e4693152c2918",
				"liveCount":0,
				"liveStatus":"",
				"name":"2014",
				"originalName":"",
				"outerRoomId":"aed0287b1df44612a21314a60ecfcb34",
				"outerUnitId":"2",
				"projectId":"e9975f291c72464f9b0cb612fa1f4e19",
				"projectName":"祥源测试社区1",
				"provinceCode":"12",
				"provinceName":"安徽省",
				"roomCode":"",
				"roomNo":"",
				"tenantId":"T025",
				"unitId":"b7eb03f3b5ab463bb4d4286fb0c8e957",
				"unitNo":""
			},
			{
				"appUserList":[],
				"aptmUuid":"",
				"buildName":"2栋",
				"buildNo":"",
				"buildingId":"2bf369312a0146e6965c9684c25c1ab8",
				"cityCode":"118",
				"cityName":"合肥市",
				"groupId":"0470aae2dd4349858337293e4455ad0f",
				"groupName":"1组团",
				"groupNo":"",
				"id":"00590a7f65ca4aca9c4b175960033e5d",
				"liveCount":0,
				"liveStatus":"",
				"name":"2016",
				"originalName":"",
				"outerRoomId":"3f4b906a7f524c20b8fe250d378b7da8",
				"outerUnitId":"2",
				"projectId":"e9975f291c72464f9b0cb612fa1f4e19",
				"projectName":"祥源测试社区1",
				"provinceCode":"12",
				"provinceName":"安徽省",
				"roomCode":"",
				"roomNo":"",
				"tenantId":"T025",
				"unitId":"b7eb03f3b5ab463bb4d4286fb0c8e957",
				"unitNo":""
			},
			{
				"appUserList":[],
				"aptmUuid":"",
				"buildName":"2栋",
				"buildNo":"",
				"buildingId":"2bf369312a0146e6965c9684c25c1ab8",
				"cityCode":"118",
				"cityName":"合肥市",
				"groupId":"0470aae2dd4349858337293e4455ad0f",
				"groupName":"1组团",
				"groupNo":"",
				"id":"303438309a374630bf5cfd161efe26af",
				"liveCount":0,
				"liveStatus":"",
				"name":"2018",
				"originalName":"",
				"outerRoomId":"53da97642d7b41b0bd5d148719107132",
				"outerUnitId":"2",
				"projectId":"e9975f291c72464f9b0cb612fa1f4e19",
				"projectName":"祥源测试社区1",
				"provinceCode":"12",
				"provinceName":"安徽省",
				"roomCode":"",
				"roomNo":"",
				"tenantId":"T025",
				"unitId":"b7eb03f3b5ab463bb4d4286fb0c8e957",
				"unitNo":""
			}
		],
		"result":""
	},
	"msg":"查询成功"
}
// 关注类型字典
const attentiondictionaryList = {
	"code":200,
	"data":{
		"list":[
			{
				"content":"",
				"dicCode":"GZRQ",
				"dicName":"关注人群通行",
				"id":"021704b3f48a49ee946e06a244d69466",
				"parentId":""
			},
			{
				"content":"",
				"dicCode":"DJLR",
				"dicName":"独居老人3天未通行",
				"id":"0a8d3c317282438290f575c75e756a3c",
				"parentId":""
			},
			{
				"content":"",
				"dicCode":"YCTX",
				"dicName":"异常通行",
				"id":"2c261bf806b049b0a5ba4a0e0aeb5605",
				"parentId":""
			}
		],
		"result":"1001"
	},
	"msg":"执行成功"
}
// 告警类型字典
const attentiondictionaryList2 = {
	"code":200,
	"data":{
		"list":[
			{
				"content":"",
				"dicCode":"SBLX",
				"dicName":"设备离线",
				"id":"021704b3f48a49ee946e06a244d69466",
				"parentId":""
			},
			{
				"content":"",
				"dicCode":"SBGZ",
				"dicName":"设备故障",
				"id":"0a8d3c317282438290f575c75e756a3c",
				"parentId":""
			},
			{
				"content":"",
				"dicCode":"MSDDL",
				"dicName":"门锁低电量",
				"id":"2c261bf806b049b0a5ba4a0e0aeb5605",
				"parentId":""
			},{
				"content":"",
				"dicCode":"7TYSWYS",
				"dicName":"7 天以上无用水",
				"id":"021704b3f48a49ee946e06a244d69466",
				"parentId":""
			},
			{
				"content":"",
				"dicCode":"7TYSWYD",
				"dicName":"7 天以上无用电",
				"id":"0a8d3c317282438290f575c75e756a3c",
				"parentId":""
			},
			{
				"content":"",
				"dicCode":"7TYSWKM",
				"dicName":"7 天以上未开门",
				"id":"2c261bf806b049b0a5ba4a0e0aeb5605",
				"parentId":""
			},{
				"content":"",
				"dicCode":"YSLGG",
				"dicName":"用水量过高",
				"id":"021704b3f48a49ee946e06a244d69466",
				"parentId":""
			},
			{
				"content":"",
				"dicCode":"YDLGG",
				"dicName":"用电量过高",
				"id":"0a8d3c317282438290f575c75e756a3c",
				"parentId":""
			},
			{
				"content":"",
				"dicCode":"YDZC",
				"dicName":"移动侦测",
				"id":"2c261bf806b049b0a5ba4a0e0aeb5605",
				"parentId":""
			}
		],
		"result":"1001"
	},
	"msg":"执行成功"
}
// 关注配置列表
const attentionConfigList = {
	"code": 200,
	"data": {
    "result": "1000 执行失败 1001 执行成功",
    "focusData": [{
      "id": '123123',
			"device": {
				"deviceSn": "设备sn",
				"deviceName": "设备名称"
      },
      "focusLvl": 'middle',
			"focusBeginTime": "yyyy-mm-dd hh:mm:ss",
			"focusEndTime": "yyyy-mm-dd hh:mm:ss",
			"personalLabel": ['GZRQ', 'DJLR'],
			"relationRealAlarm": "1",
			"relationOrder": "0"
		}]
	},
	"msg": "执行成功"
}
// 操作关注配置
const attentionOperate = {
	"code": 200,
	"data": {
		"result": "1000 执行失败 1001 执行成功"
	},
	"msg": "执行成功"
}
// 楼栋关注设备列表
const buildFocusDeviceList = {
	"code": 200,
	"data": {
		"result": "1000 执行失败 1001 执行成功",
		"groupList": [{
			"groupId": "",
			"groupName": "组团名称1",
			"buildList": [{
				"buildId": "楼栋id1",
				"buildName": "楼栋名称1",
				"deviceTypeList": [{
					"deviceType": "lift",
					"deviceList": [
            {
                "antId": "",
                "desc": "",
                "deviceCode": "",
                "deviceEnabled": "1",
                "deviceIp": "",
                "deviceMac": "88:3b:8b:03:02:07",
                "deviceName": "1期1栋1单元1010室 1号",
                "devicePassword": "",
                "deviceProperties": {},
                "deviceRegTime": 1571911145000,
                "deviceSn": "HA301A0250P0009",
                "deviceStatus": "",
                "deviceUpdateTime": null,
                "deviceUuid": "5de760793032b4004d89e628",
                "firmwareMode": "",
                "firmwareVersion": "",
                "heartBeatTime": "2019-12-09 17:46:23",
                "id": "5db175ea45ce256dd28bcc4b",
                "manufacturerId": "",
                "manufacturerName": "",
                "projectAddress": "",
                "record": "",
                "recordTime": "",
                "smartTalkStatus": "1",
                "tenantId": ""
            }
          ]
				},{
					"deviceType": "monitor",
					"deviceList": [
            {
                "antId": "",
                "desc": "",
                "deviceCode": "",
                "deviceEnabled": "1",
                "deviceIp": "",
                "deviceMac": "88:3b:8b:03:02:07",
                "deviceName": "1期1栋1单元1010室 1号",
                "devicePassword": "",
                "deviceProperties": {},
                "deviceRegTime": 1571911145000,
                "deviceSn": "HA301A0250P0009",
                "deviceStatus": "",
                "deviceUpdateTime": null,
                "deviceUuid": "5de760793032b4004d89e628",
                "firmwareMode": "",
                "firmwareVersion": "",
                "heartBeatTime": "2019-12-09 17:46:23",
                "id": "5db175ea45ce256dd28bcc4b1",
                "manufacturerId": "",
                "manufacturerName": "",
                "projectAddress": "",
                "record": "",
                "recordTime": "",
                "smartTalkStatus": "1",
                "tenantId": ""
            }
          ]
				},{
					"deviceType": "doorctl_v2",
					"deviceList": [
            {
                "antId": "",
                "desc": "",
                "deviceCode": "",
                "deviceEnabled": "1",
                "deviceIp": "",
                "deviceMac": "88:3b:8b:03:02:07",
                "deviceName": "1期1栋1单元1010室 1号",
                "devicePassword": "",
                "deviceProperties": {},
                "deviceRegTime": 1571911145000,
                "deviceSn": "HA301A0250P0009",
                "deviceStatus": "",
                "deviceUpdateTime": null,
                "deviceUuid": "5de760793032b4004d89e628",
                "firmwareMode": "",
                "firmwareVersion": "",
                "heartBeatTime": "2019-12-09 17:46:23",
                "id": "5db175ea45ce256dd28bcc4b2",
                "manufacturerId": "",
                "manufacturerName": "",
                "projectAddress": "",
                "record": "",
                "recordTime": "",
                "smartTalkStatus": "1",
                "tenantId": ""
            }
          ]
				}]
			},{
        "buildId": "楼栋id2",
        "buildName": "楼栋名称2",
				"deviceTypeList": [{
					"deviceType": "monitor",
					"deviceList": [
            {
                "antId": "",
                "desc": "",
                "deviceCode": "",
                "deviceEnabled": "1",
                "deviceIp": "",
                "deviceMac": "88:3b:8b:03:02:07",
                "deviceName": "1期1栋1单元1010室 1号",
                "devicePassword": "",
                "deviceProperties": {},
                "deviceRegTime": 1571911145000,
                "deviceSn": "HA301A0250P0009",
                "deviceStatus": "0",
                "deviceUpdateTime": null,
                "deviceUuid": "5de760793032b4004d89e628",
                "firmwareMode": "",
                "firmwareVersion": "",
                "heartBeatTime": "2019-12-09 17:46:23",
                "id": "5db175ea45ce256dd28bcc4b3",
                "manufacturerId": "",
                "manufacturerName": "",
                "projectAddress": "",
                "record": "",
                "recordTime": "",
                "smartTalkStatus": "1",
                "tenantId": ""
            },
            {
              "antId": "",
              "desc": "",
              "deviceCode": "",
              "deviceEnabled": "1",
              "deviceIp": "",
              "deviceMac": "88:3b:8b:03:02:07",
              "deviceName": "1期1栋1单元1010室 1号",
              "devicePassword": "",
              "deviceProperties": {},
              "deviceRegTime": 1571911145000,
              "deviceSn": "HA301A0250P0009",
              "deviceStatus": "",
              "deviceUpdateTime": null,
              "deviceUuid": "5de760793032b4004d89e628",
              "firmwareMode": "",
              "firmwareVersion": "",
              "heartBeatTime": "2019-12-09 17:46:23",
              "id": "5db175ea45ce256dd28bcc4b4",
              "manufacturerId": "",
              "manufacturerName": "",
              "projectAddress": "",
              "record": "",
              "recordTime": "",
              "smartTalkStatus": "1",
              "tenantId": ""
          }
          ]
				}]
		}]
		},
		{
			"groupId": "",
			"groupName": "组团名称2",
			"buildList": [{
				"buildId": "楼栋id3",
				"buildName": "楼栋名称3",
				"deviceTypeList": [{
					"deviceType": "facesentry",
					"deviceList": [
            {
                "antId": "",
                "desc": "",
                "deviceCode": "",
                "deviceEnabled": "1",
                "deviceIp": "",
                "deviceMac": "88:3b:8b:03:02:07",
                "deviceName": "1期1栋1单元1010室 1号",
                "devicePassword": "",
                "deviceProperties": {},
                "deviceRegTime": 1571911145000,
                "deviceSn": "HA301A0250P0009",
                "deviceStatus": "",
                "deviceUpdateTime": null,
                "deviceUuid": "5de760793032b4004d89e628",
                "firmwareMode": "",
                "firmwareVersion": "",
                "heartBeatTime": "2019-12-09 17:46:23",
                "id": "5db175ea45ce256dd28bcc4b6",
                "manufacturerId": "",
                "manufacturerName": "",
                "projectAddress": "",
                "record": "",
                "recordTime": "",
                "smartTalkStatus": "1",
                "tenantId": ""
            }
          ]
				}]
			}]
		}],
		"totalCnt": '12'
	},
	"msg": ""
}
// 公区关注设备列表
const publicFocusDeviceList = {
  "code": 200,
  "data": {
      "deviceTypeList": [
          {
              "deviceType": "doorctl",
              "list": [
                  {
                      "antId": "",
                      "desc": "",
                      "deviceCode": "",
                      "deviceEnabled": "1",
                      "deviceIp": "",
                      "deviceMac": "88:3b:8b:03:02:07",
                      "deviceName": "1期1栋1单元1010室 1号",
                      "devicePassword": "",
                      "deviceProperties": {},
                      "deviceRegTime": 1571911145000,
                      "deviceSn": "HA301A0250P0009",
                      "deviceStatus": "0",
                      "deviceUpdateTime": null,
                      "deviceUuid": "5de760793032b4004d89e628",
                      "firmwareMode": "",
                      "firmwareVersion": "",
                      "heartBeatTime": "2019-12-09 17:46:23",
                      "id": "5db175ea45ce256dd28bcc4b",
                      "manufacturerId": "",
                      "manufacturerName": "",
                      "projectAddress": "",
                      "record": "",
                      "recordTime": "",
                      "smartTalkStatus": "1",
                      "tenantId": ""
                  },
                  {
                    "antId": "",
                    "desc": "",
                    "deviceCode": "",
                    "deviceEnabled": "1",
                    "deviceIp": "",
                    "deviceMac": "88:3b:8b:03:02:07",
                    "deviceName": "1期1栋1单元1010室 1号",
                    "devicePassword": "",
                    "deviceProperties": {},
                    "deviceRegTime": 1571911145000,
                    "deviceSn": "HA301A0250P0009",
                    "deviceStatus": "1",
                    "deviceUpdateTime": null,
                    "deviceUuid": "5de760793032b4004d89e628",
                    "firmwareMode": "",
                    "firmwareVersion": "",
                    "heartBeatTime": "2019-12-09 17:46:23",
                    "id": "5db175ea45ce256dd28bcc4b0",
                    "manufacturerId": "",
                    "manufacturerName": "",
                    "projectAddress": "",
                    "record": "",
                    "recordTime": "",
                    "smartTalkStatus": "1",
                    "tenantId": ""
                }
              ]
          },
          {
            "deviceType": "monitor",
            "list": [
                {
                  "antId": "",
                  "desc": "",
                  "deviceCode": "",
                  "deviceEnabled": "1",
                  "deviceIp": "",
                  "deviceMac": "88:3b:8b:03:02:07",
                  "deviceName": "1期1栋1单元1010室 1号",
                  "devicePassword": "",
                  "deviceProperties": {},
                  "deviceRegTime": 1571911145000,
                  "deviceSn": "HA301A0250P0009",
                  "deviceStatus": "1",
                  "deviceUpdateTime": null,
                  "deviceUuid": "5de760793032b4004d89e628",
                  "firmwareMode": "",
                  "firmwareVersion": "",
                  "heartBeatTime": "2019-12-09 17:46:23",
                  "id": "5db175ea45ce256dd28bcc4b2",
                  "manufacturerId": "",
                  "manufacturerName": "",
                  "projectAddress": "",
                  "record": "",
                  "recordTime": "",
                  "smartTalkStatus": "1",
                  "tenantId": ""
              }
            ]
          },
          {
            "deviceType": "park",
            "list": [
              {
                "antId": "",
                "desc": "",
                "deviceCode": "",
                "deviceEnabled": "1",
                "deviceIp": "",
                "deviceMac": "88:3b:8b:03:02:07",
                "deviceName": "1期1栋1单元1010室 1号",
                "devicePassword": "",
                "deviceProperties": {
                  "other": {},
                  "location": [
                      {
                          "buildName": "楼栋名称",
                          "unitName": "单元名称",
                          "aptmUuid": "云对讲使用的aptmuuid",
                          "cityCode": "1 城市编码",
                          "provinceCode": "1 省份编码",
                          "groupId": "组团id",
                          "buildId": "楼栋id",
                          "gateName": "北门",
                          "roomId": "房屋id",
                          "roomName": "房屋名称",
                          "groupName": "组团名称",
                          "cityName": "北京市 城市名称",
                          "unitId": "单元id",
                          "provinceName": "北京市 省份名称",
                          "projectName": "长楹天街住宅QA测试社区 项目名称",
                          "projectId": "3faf1aaa782a4db5a07ae8dcc86f6873 项目id",
                          "direction": "O",
                          "outerUnitId": "外部单元id 门禁二代使用"
                      }
                  ],
                  "type": "park"
                },
                "deviceRegTime": 1571911145000,
                "deviceSn": "HA301A0250P0009",
                "deviceStatus": "1",
                "deviceUpdateTime": null,
                "deviceUuid": "5de760793032b4004d89e628",
                "firmwareMode": "",
                "firmwareVersion": "",
                "heartBeatTime": "2019-12-09 17:46:23",
                "id": "5db175ea45ce256dd28bcc4b4",
                "manufacturerId": "",
                "manufacturerName": "",
                "projectAddress": "",
                "record": "",
                "recordTime": "",
                "smartTalkStatus": "1",
                "tenantId": ""
              },
              {
                  "antId": "",
                  "desc": "",
                  "deviceCode": "",
                  "deviceEnabled": "1",
                  "deviceIp": "",
                  "deviceMac": "88:3b:8b:03:02:07",
                  "deviceName": "1期1栋1单元1010室 1号",
                  "devicePassword": "",
                  "deviceProperties": {
                    "other": {},
                    "location": [
                        {
                            "buildName": "楼栋名称",
                            "unitName": "单元名称",
                            "aptmUuid": "云对讲使用的aptmuuid",
                            "cityCode": "1 城市编码",
                            "provinceCode": "1 省份编码",
                            "groupId": "组团id",
                            "buildId": "楼栋id",
                            "gateName": "北门",
                            "roomId": "房屋id",
                            "roomName": "房屋名称",
                            "groupName": "组团名称",
                            "cityName": "北京市 城市名称",
                            "unitId": "单元id",
                            "provinceName": "北京市 省份名称",
                            "projectName": "长楹天街住宅QA测试社区 项目名称",
                            "projectId": "3faf1aaa782a4db5a07ae8dcc86f6873 项目id",
                            "direction": "I",
                            "outerUnitId": "外部单元id 门禁二代使用"
                        }
                    ],
                    "type": "park"
                  },
                  "deviceRegTime": 1571911145000,
                  "deviceSn": "HA301A0250P0009",
                  "deviceStatus": "1",
                  "deviceUpdateTime": null,
                  "deviceUuid": "5de760793032b4004d89e628",
                  "firmwareMode": "",
                  "firmwareVersion": "",
                  "heartBeatTime": "2019-12-09 17:46:23",
                  "id": "5db175ea45ce256dd28bcc4b5",
                  "manufacturerId": "",
                  "manufacturerName": "",
                  "projectAddress": "",
                  "record": "",
                  "recordTime": "",
                  "smartTalkStatus": "1",
                  "tenantId": ""
              }
            ]
          },
          {
            "deviceType": "lockergateway",
            "list": [
              {
                "antId": "",
                "desc": "",
                "deviceCode": "",
                "deviceEnabled": "1",
                "deviceIp": "",
                "deviceMac": "88:3b:8b:03:02:07",
                "deviceName": "1期1栋1单元1010室 1号",
                "devicePassword": "",
                "deviceProperties": {
                  "other": {},
                  "location": [
                      {
                          "buildName": "楼栋名称",
                          "unitName": "单元名称",
                          "aptmUuid": "云对讲使用的aptmuuid",
                          "cityCode": "1 城市编码",
                          "provinceCode": "1 省份编码",
                          "groupId": "组团id",
                          "buildId": "楼栋id",
                          "gateName": "北门",
                          "roomId": "房屋id",
                          "roomName": "房屋名称",
                          "groupName": "组团名称",
                          "cityName": "北京市 城市名称",
                          "unitId": "单元id",
                          "provinceName": "北京市 省份名称",
                          "projectName": "长楹天街住宅QA测试社区 项目名称",
                          "projectId": "3faf1aaa782a4db5a07ae8dcc86f6873 项目id",
                          "direction": "O",
                          "outerUnitId": "外部单元id 门禁二代使用"
                      }
                  ],
                  "type": "park"
                },
                "deviceRegTime": 1571911145000,
                "deviceSn": "HA301A0250P0009",
                "deviceStatus": "1",
                "deviceUpdateTime": null,
                "deviceUuid": "5de760793032b4004d89e628",
                "firmwareMode": "",
                "firmwareVersion": "",
                "heartBeatTime": "2019-12-09 17:46:23",
                "id": "5db175ea45ce256dd28bcc4b7",
                "manufacturerId": "",
                "manufacturerName": "",
                "projectAddress": "",
                "record": "",
                "recordTime": "",
                "smartTalkStatus": "1",
                "tenantId": ""
              }
            ]
          },
          {
            "deviceType": "facesentry",
            "list": [
              {
                "antId": "",
                "desc": "",
                "deviceCode": "",
                "deviceEnabled": "1",
                "deviceIp": "",
                "deviceMac": "88:3b:8b:03:02:07",
                "deviceName": "1期1栋1单元1010室 1号",
                "devicePassword": "",
                "deviceProperties": {
                  "other": {},
                  "location": [
                      {
                          "buildName": "楼栋名称",
                          "unitName": "单元名称",
                          "aptmUuid": "云对讲使用的aptmuuid",
                          "cityCode": "1 城市编码",
                          "provinceCode": "1 省份编码",
                          "groupId": "组团id",
                          "buildId": "楼栋id",
                          "gateName": "北门",
                          "roomId": "房屋id",
                          "roomName": "房屋名称",
                          "groupName": "组团名称",
                          "cityName": "北京市 城市名称",
                          "unitId": "单元id",
                          "provinceName": "北京市 省份名称",
                          "projectName": "长楹天街住宅QA测试社区 项目名称",
                          "projectId": "3faf1aaa782a4db5a07ae8dcc86f6873 项目id",
                          "direction": "O",
                          "outerUnitId": "外部单元id 门禁二代使用"
                      }
                  ],
                  "type": "park"
                },
                "deviceRegTime": 1571911145000,
                "deviceSn": "HA301A0250P0009",
                "deviceStatus": "1",
                "deviceUpdateTime": null,
                "deviceUuid": "5de760793032b4004d89e628",
                "firmwareMode": "",
                "firmwareVersion": "",
                "heartBeatTime": "2019-12-09 17:46:23",
                "id": "5db175ea45ce2516dd28bcc1b7",
                "manufacturerId": "",
                "manufacturerName": "",
                "projectAddress": "",
                "record": "",
                "recordTime": "",
                "smartTalkStatus": "1",
                "tenantId": ""
              }
            ]
          }
      ],
      "result": "1001"
  },
  "msg": "执行成功"
}
Mock.mock(/\/api\/json\/platformDeviceApi\/getProjectFocusDeviceList/, 'post', () => {
  return publicFocusDeviceList
})

Mock.mock(/\/api\/json\/platformDeviceApi\/getBuildFocusDeviceList/, 'post', () => {
  return buildFocusDeviceList
})

Mock.mock(/\/api\/json\/focusConfApi\/operateFocusConf/, 'post', () => {
  return attentionOperate
})
Mock.mock(/\/api\/json\/focusConfApi\/getFocusList/, 'post', () => {
  return attentionConfigList
})
Mock.mock(/\/api\/json\/dictionaryApi\/getDictionaryList/, 'post', (options) => {
  let params =  qs.parse(decodeURIComponent(options.body))
  try {
    params = JSON.parse(params.body)
  } catch (error) {
    // 
  }
  if(params.dicType =='AlarmConf') {
    return attentiondictionaryList2
  } else {
    return attentiondictionaryList
  }
})
Mock.mock(/\/api\/json\/roomApi\/getUnitRoomList/, 'post', () => {
  return roomData
})

Mock.mock(/\/api\/json\/unitApi\/getUnitListByBuildId/, 'post', () => {
  return unitData
})

Mock.mock(/\/api\/json\/platformDeviceApi\/setTopDevice/, 'post', () => {
  return topData
})

Mock.mock(/\/api\/json\/workOrderApi\/getOrderDetail/, 'post', () => {
  return orderDetail
})

Mock.mock(/\/api\/json\/workOrderApi\/getOrderInfoStatistic/, 'post', () => {
  return orderInfo
})

Mock.mock(/\/api\/json\/workOrderApi\/getOrderRecord/, 'post', () => {
  return orderRecord
})

Mock.mock(/\/api\/json\/workOrderApi\/getOrderStatisticCurrentDay/, 'post', () => {
  return orderStatistic
})
Mock.mock(/\/api\/json\/workOrderApi\/getOrderTypeStatisticCurrentDay/, 'post', (options) => {
  console.log(options.url)
  let params =  qs.parse(decodeURIComponent(options.body))
  try {
    params = JSON.parse(params.body)
  } catch (error) {
    // 
  }
  if(params.statisticMode =='alarmtype') {
    return orderTypeStatistic2
  } else {
    return orderTypeStatistic
  }
})
export default Mock

