import Mock from 'mockjs'
Mock.setup({
  timeout: 300, // 设置延迟响应，模拟向后端请求数据
})
// 修改账户密码
const modifyPwd = {
	"code":200,
	"data":{
		"result":"模拟内容7547862684318882696"
	},
	"msg":""
}

// 1.1.1 信息总览
const overviewdata = {
  "code": 200,
  "data": {
    "result": "1000 执行失败 1001 执行成功",
    "info": {
      city: 55,
      project: 2919,
      area: 12.8,
      user: 2183092,
      build: 40182,
      parking: 108091,
    }
  },
  "msg": "执行成功"
}
// 1.1.2 人流量
const statisticData = {
	"code": 200,
	"data": {
		"result": "1000 执行失败 1001 执行成功",
		"owner": [{
        "statisticDate": "00:00",
        "passingData": 50
      },
      {
        "statisticDate": "01:00",
        "passingData": 80
      },
      {
        "statisticDate": "02:00",
        "passingData": 100
    }],
		"visitor": [{
        "statisticDate": "00:00",
        "passingData": 20
      },
      {
        "statisticDate": "01:00",
        "passingData": 90
      },
      {
        "statisticDate": "02:00",
        "passingData": 10
    }]
	},
	"msg": "执行成功"
}
// 1.1.3 车流量
const flowData = {
	"code": 200,
	"data": {
		"result": "1000 执行失败 1001 执行成功",
		"vechicleIn": [{
			"statisticDate": "00:00",
			"flowData": 60
		},
		{
			"statisticDate": "01:00",
			"flowData": 12
		},
		{
			"statisticDate": "02:00",
			"flowData": 70
		}],
		"vechicleOut": [{
			"statisticDate": "00:00",
			"flowData": 100
		},
		{
			"statisticDate": "01:00",
			"flowData": 55
		},
		{
			"statisticDate": "02:00",
			"flowData": 88
		}]
	},
	"msg": "执行成功"
}
// 车位数量 接口未定义

// 各城市/社区人流量
const passingData = {
	"code": 200,
	"data": {
		"result": "1000 执行失败 1001 执行成功",
		"passing": [{
        "id": "123",
        "name": "重庆",
        "totalPassing": '100',
        "personLabel": [{
          "labelCode": "yz",
          "labelName": "业主",
          "labelPassing": 20
        }, {
          "labelCode": "yz",
          "labelName": "访客",
          "labelPassing": 79
        }]
      },
      {
        "id": "123",
        "name": "成都",
        "totalPassing": '100',
        "personLabel": [{
          "labelCode": "yz",
          "labelName": "业主",
          "labelPassing": 60
        }, {
          "labelCode": "yz",
          "labelName": "访客",
          "labelPassing": 39
        }]
      }
    ]
	},
	"msg": "执行成功"
}
//  各城市/社区告警量
const alarmData = {
	"code": 200,
	"data": {
		"result": "1000 执行失败 1001 执行成功",
		"alarmInfo": [{
			"id": "123",
			"name": "重庆",
			"total": '100',
			"wait": '30',
			"dealing": '40',
			"done": '30'
		},
    {
			"id": "123",
			"name": "成都",
			"total": '100',
			"wait": '50',
			"dealing": '30',
			"done": '20'
		},{
			"id": "123",
			"name": "深圳",
			"total": '100',
			"wait": '50',
			"dealing": '30',
			"done": '20'
		}]
	},
	"msg": "执行成功"
}
// 工单

// IoT设备情况
const iotData = {
	"code": 200,
	"data": {
		"result": "1000 执行失败 1001 执行成功",
		"totalDevice":123123,
		"newDevice":355,
		"deviceStatusInfo": [{
			"device": '智能门禁',
			"deviceType": "设备类型",
			"total": 100,
			"fault": 30,
			"offLine": 30,
			"onLine": 40
		},
		{
			"device": '人脸门禁',
			"deviceType": "设备类型",
			"total": 100,
			"fault": 30,
			"offLine": 30,
			"onLine": 40
		},{
			"device": '智能门禁',
			"deviceType": "设备类型",
			"total": 100,
			"fault": 30,
			"offLine": 30,
			"onLine": 40
		},
		{
			"device": '人脸门禁',
			"deviceType": "设备类型",
			"total": 100,
			"fault": 30,
			"offLine": 30,
			"onLine": 40
		},{
			"device": '智能门禁',
			"deviceType": "设备类型",
			"total": 100,
			"fault": 30,
			"offLine": 30,
			"onLine": 40
		},
		{
			"device": '人脸门禁',
			"deviceType": "设备类型",
			"total": 100,
			"fault": 30,
			"offLine": 30,
			"onLine": 40
		}]
	},
	"msg": "执行成功"
}
// IoT设备统计图
const iotLineChartData = {
	"code": 200,
	"data": {
		"result": "1000 执行失败 1001 执行成功",
		"offLine": [{
			"statisticDate": "20190101",
			"count": 100
		},
		{
			"statisticDate": "20190102",
			"count": 200
		},
		{
			"statisticDate": "20190103",
			"count": 300
		}],
		"fault": [{
			"statisticDate": "20190101",
			"count": 400
		},
		{
			"statisticDate": "20190102",
			"count": 200
		},
		{
			"statisticDate": "20190103",
			"count": 600
		}]
	},
	"msg": "执行成功"
}
// 获取城市级别/项目级别的统计数据

const mapInfo = {
	"code": 200,
	"data": {
		"result": "1000 执行失败 1001 执行成功",
		"mapInfo": [{
			"id": "城市/社区id",
			"name": "深圳",
			"onlineDevice": 100,
			"people": 100,
			"car": 11,
			"order": 11,
			"latitude": 113.906389,
			"longitude": 22.527895,
			"alarm": 0
    },{
			"id": "城市/社区id",
			"name": "成都",
			"onlineDevice": 100,
			"people": 100,
			"car": 11,
			"order": 11,
			"latitude": 113.943468,
			"longitude": 22.547713,
			"alarm": 0
    },
		{
			"id": "城市/社区id",
			"name": "长沙",
			"onlineDevice": 100,
			"people": 100,
			"car": 11,
			"order": 11,
			"latitude": 113.065746,
			"longitude": 28.149671,
			"alarm": 1
		}, {
			"id": "城市/社区id",
			"name": "北京",
			"onlineDevice": 100,
			"people": 100,
			"car": 11,
			"order": 11,
			"latitude": 116.407387,
			"longitude": 39.904179,
			"alarm": 1
		}]
	},
	"msg": "执行成功"
}
// 获取社区重点关注通行记录

const passingRecord = {
	"code": 200,
	"data": {
		"result": "1000 执行失败 1001 执行成功",
		"passingMonitorRecordList": [{
			"id":"通行记录id",
			"sn":"通行记录设备sn",
			"location":"通行位置",
			"roomInfo":"D1 2002",
			"mobile":"18666594641",
			"monitorType":"关注类型",
			"faceUrl":"抓拍图片",
			"dealStatus":"是否已经处理",
      "name":"张三三",
      "recordTime": "11.02 8:00"
		},{
			"id":"通行记录id",
			"sn":"通行记录设备sn",
			"location":"通行位置2",
			"roomInfo":"D1 2002",
			"mobile":"18666594641",
			"monitorType":"关注类型2",
			"faceUrl":"抓拍图片",
			"dealStatus":"是否已经处理",
      "name":"张三2",
      "recordTime": "11.02 8:00"
		}]
	},
	"msg": "执行成功"
}
// 当天重点关注统计
const passCurrentDay = {
	"code": 200,
	"data": {
		"result": "1000 执行失败 1001 执行成功",
		"passingMonitorStatistic": [{
			"monitorType":"关住类型",
			"monitorName":"访客通行",
			"monitorCount":100
		},{
			"monitorType":"关住类型",
			"monitorName":"特殊人员通行",
			"monitorCount":200
		},{
			"monitorType":"关住类型",
			"monitorName":"特殊位置通行",
			"monitorCount":100
		},{
			"monitorType":"关住类型",
			"monitorName":"敏感时间段通行",
			"monitorCount":300
		},{
			"monitorType":"关住类型",
			"monitorName":"连续多天未通行",
			"monitorCount":200
		}]
	},
	"msg": "执行成功"
}
// 当月重点关注统计
const passMonth = {
	"code": 200,
	"data": {
		"result": "1000 执行失败 1001 执行成功",
		"passingMonitorStatistic": [{
			"monitorType": "关住类型",
			"monitorName": "关注名称",
			"monitorStatistic": [{
				"time": "20190101",
				"count": 100
			},
			{
				"time": "20190102",
				"count": 80
			},
			{
				"time": "20190103",
				"count": 90
			}]
		},{
			"monitorType": "关住类型",
			"monitorName": "关注名称",
			"monitorStatistic": [{
				"time": "20190101",
				"count": 10
			},
			{
				"time": "20190102",
				"count": 8
			},
			{
				"time": "20190103",
				"count": 9
			}]
		},{
			"monitorType": "关住类型",
			"monitorName": "关注名称",
			"monitorStatistic": [{
				"time": "20190101",
				"count": 30
			},
			{
				"time": "20190102",
				"count": 40
			},
			{
				"time": "20190103",
				"count": 20
			}]
		},{
			"monitorType": "关住类型",
			"monitorName": "关注名称",
			"monitorStatistic": [{
				"time": "20190101",
				"count": 50
			},
			{
				"time": "20190102",
				"count": 60
			},
			{
				"time": "20190103",
				"count": 55
			}]
		},{
			"monitorType": "关住类型",
			"monitorName": "关注名称",
			"monitorStatistic": [{
				"time": "20190101",
				"count": 70
			},
			{
				"time": "20190102",
				"count": 77
			},
			{
				"time": "20190103",
				"count": 80
			}]
		}]
	},
	"msg": "执行成功"
}
// 当月重点关注统计
const confirmMonitorRecord = {
	"code": 200,
	"data": {},
	"msg": "执行成功"
}

// 获取社区告警记录
const alarmRecord = {
	"code": 200,
	"data": {
		"result": "1000 执行失败 1001 执行成功",
		"passingMonitorRecordList": [{
			"id":"通行记录id",
			"sn":"通行记录设备sn",
			"location":"通行位置",
			"roomInfo":"D1 2002",
			"mobile":"18666594641",
			"monitorType":"关注类型",
			"faceUrl":"抓拍图片",
			"dealStatus":"已处理",
      "name":"张三1",
      "recordTime": "11.02 8:00"
		},{
			"id":"通行记录id",
			"sn":"通行记录设备sn",
			"location":"通行位置",
			"roomInfo":"D1 2002",
			"mobile":"18666594641",
			"monitorType":"关注类型2",
			"faceUrl":"抓拍图片",
			"dealStatus":"已处理2",
      "name":"张三2",
      "recordTime": "11.02 8:00"
		}]
	},
	"msg": "执行成功"
}
// 当日告警记录统计
const alarmCurrentDay = {
	"code": 200,
	"data": {
		"result": "1000 执行失败 1001 执行成功",
		"passingMonitorStatistic": [{
			"monitorType":"关住类型",
			"monitorName":"访客通行",
			"monitorCount":100
		},{
			"monitorType":"关住类型",
			"monitorName":"特殊人员通行",
			"monitorCount":200
		},{
			"monitorType":"关住类型",
			"monitorName":"特殊位置通行",
			"monitorCount":100
		},{
			"monitorType":"关住类型",
			"monitorName":"敏感时间段通行",
			"monitorCount":300
		}]
	},
	"msg": "执行成功"
}
// 当月告警记录统计
const alarmMonth = {
	"code": 200,
	"data": {
		"result": "1000 执行失败 1001 执行成功",
		"passingMonitorStatistic": [{
			"monitorType": "关住类型",
			"monitorName": "关注名称",
			"monitorStatistic": [{
				"time": "20190101",
				"count": 100
			},
			{
				"time": "20190102",
				"count": 80
			},
			{
				"time": "20190103",
				"count": 90
			}]
		},{
			"monitorType": "关住类型",
			"monitorName": "关注名称",
			"monitorStatistic": [{
				"time": "20190101",
				"count": 10
			},
			{
				"time": "20190102",
				"count": 8
			},
			{
				"time": "20190103",
				"count": 9
			}]
		},{
			"monitorType": "关住类型",
			"monitorName": "关注名称",
			"monitorStatistic": [{
				"time": "20190101",
				"count": 30
			},
			{
				"time": "20190102",
				"count": 40
			},
			{
				"time": "20190103",
				"count": 20
			}]
		},{
			"monitorType": "关住类型",
			"monitorName": "关注名称",
			"monitorStatistic": [{
				"time": "20190101",
				"count": 50
			},
			{
				"time": "20190102",
				"count": 60
			},
			{
				"time": "20190103",
				"count": 55
			}]
		}]
	},
	"msg": "执行成功"
}
// 处理告警信息
const confirmAlarmInfo = {
	"code": 200,
	"data": {},
	"msg": "执行成功"
}

//获取社区楼栋列表

const buildList = {
	"code": 200,
	"data": {
		"result": "1000 执行失败 1001 执行成功",
		"groupList": [{
			"groupId": "组团1",
			"groupName": "组团1",
			"buildList": [{
				"buildId": "楼栋id",
				"buildName": "楼栋名称1"
			}]
		},{
			"groupId": "组团1",
			"groupName": "组团2",
			"buildList": [{
				"buildId": "楼栋id3",
				"buildName": "楼栋名称2"
			}]
		},{
			"groupId": "组团1",
			"groupName": "组团1",
			"buildList": [{
				"buildId": "楼栋id1",
				"buildName": "楼栋名称3"
			}]
		},{
			"groupId": "组团1",
			"groupName": "组团2",
			"buildList": [{
				"buildId": "楼栋id2",
				"buildName": "楼栋名称4"
			}]
		}],
		"totalCnt": '20'
	},
	"msg": ""
}
// 获取社区/楼栋下设备类型列表
const deviceTypeList = {
	"code": 200,
	"data": {
		"result": "1000 执行失败 1001 执行成功",
		"mapInfo": [{
			"deviceType": "doorctl",
			"deviceName": "社区门禁"
		},{
			"deviceType": "lockergateway",
			"deviceName": "门锁网关"
		},{
			"deviceType": "type2",
			"deviceName": "社区监控"
		},{
			"deviceType": "type3",
			"deviceName": "社区车行"
		},{
			"deviceType": "locker",
			"deviceName": "门锁"
		},{
			"deviceType": "elec",
			"deviceName": "电表"
		}]
	},
	"msg": "执行成功"
}

// 展示社区/楼栋下安装的设备列表
const deviceList = {
  "code": 200,
  "data": {
      "deviceList": [
          {
              "antId": "第三方id",
              "desc": "设备描述",
              "deviceCode": "设备型号",
              "deviceEnabled": "设备是否可用 0 不可用 1 可用",
              "deviceIp": "设备ip地址",
              "deviceMac": "设备mac地址",
              "deviceName": "设备名称",
              "devicePassword": "设备登录密码",
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
                          "direction": "出口",
                          "outerUnitId": "外部单元id 门禁二代使用"
                      }
                  ],
                  "type": "elec"
              },
              "deviceRegTime": '1564632055000 注册时间',
              "deviceSn": "设备sn",
              "deviceStatus": "0 设备状态 0 离线 1 在线",
              "deviceUpdateTime": '设备信息更新时间',
              "deviceUuid": "5d4263173a6f95377203f652 设备uuid对应上报的数据服务器id",
              "firmwareMode": "固件型号",
              "firmwareVersion": "固件版本",
              "heartBeatTime": "心跳时间",
              "id": "5d4263f745ce256a98ddb302 设备id",
              "manufacturerId": "厂商id",
              "manufacturerName": "厂商名称",
              "projectAddress": "北京市朝阳区朝阳北路与东十里堡路交叉点向南150米路西 设备所在项目地址",
              "smartTalkStatus": "智能对讲设备状态 0 离线 1 在线",
              "tenantId": "T001 租户id"
          }
      ],
      "pageNo": 1,
      "pageSize": 50,
      "result": "1001",
      "totalCnt": 9
  },
  "msg": "执行成功"
}
const logList = {
	"code": 200,
	"msg": "执行成功",
	"recordList": [{
		"deviceId": "设备id",
		"sn": "设备sn",
		"recordTime": "记录产生时间",
		"phone": "手机号",
		"cardNo": "门禁卡号",
		"userName": "姓名",
		"personLabel": "人员标签",
		"passType": "门禁通行类型",
		"operationType": "操作类型",
		"url": "照片或者视频的链接地址",
		"status": "设备状态(offLine 离线 onLine 在线 lowBattery 低电量)",
    "readRecord": '水表读数',
    "alarmLvl": '高'
	},
	{
		"deviceId": "设备id",
		"sn": "设备sn",
		"recordTime": "记录产生时间",
		"phone": "手机号",
		"cardNo": "门禁卡号",
		"userName": "姓名",
		"personLabel": "人员标签",
		"passType": "门禁通行类型",
		"operationType": "操作类型",
		"url": "照片或者视频的链接地址",
		"status": "设备状态(offLine 离线 onLine 在线 lowBattery 低电量)",
    "readRecord": '水表读数',
    "alarmLvl": '高'
	}]
}

const openLockList = {
	"code": 200,
	"msg": "执行成功",
  "data": {
    "gyOperationLogList": [
        {
          "time": '2019.09.01 11:10:10',
          'userId': '我是用户',
        }
    ],
    "pageNo": 1,
    "pageSize": 50,
    "result": "1001",
    "totalCnt": 9
  },
}

const pwdList = {
	"code": 200,
	"data": {
		"content": [{
			"validStartTime": '有效期开始时间',
			"pwdType": "密码类型",
			"userPhone": null,
			"addFrom": "",
			"remark": null,
			"userName": "用户名称",
			"createrName": null,
			"sendTime": 0,
			"pwdStatus": "11",
			"password": "",
			"validEndTime": '有效期结束时间',
			"gyIndex": 1,
			"createTime": 1561979901712,
			"pwdId": "5d19ebfd45cecb308f05a985",
			"pwdNo": "1"
		}],
		"result": "1001"
	},
	"msg": ""
}
const pwdStatus = {
	"code": 200,
	"data": {
		"result": "1001"
	},
	"msg": ""
}

const dayUse = {
  "code": 200,
  "data": {
      "list": [
          {
              "readDate": '2019.11.12',
              "readRecord": '3.5',
              "sn": "AD00000080806894",
              "useRecord": '1.3'
          },
          {
            "readDate": '2019.11.13',
            "readRecord": '4.5',
            "sn": "AD00000080806894",
            "useRecord": '2.3'
          },
          {
            "readDate": '2019.11.14',
            "readRecord": '5.5',
            "sn": "AD00000080806894",
            "useRecord": '3.3'
          }
      ],
      "pageNo": 1,
      "pageSize": 50,
      "result": "1001",
      "totalCnt": 1
  },
  "msg": "执行成功"
}

const totalUser = {
	"code": 200,
	"data": {
		"sn": "设备sn",
		"cumulativeRecord": "123",
		"result": "1001 执行成功 1000 执行失败"
	},
	"msg": ""
}

const cityList = {
	"code":200,
	"data":{
		"list":[
			{
				"cityCode":"1",
				"cityName":"北京市"
			},
			{
				"cityCode":"6",
				"cityName":"宁波市"
			},
			{
				"cityCode":"14",
				"cityName":"杭州市"
			},
			{
				"cityCode":"114",
				"cityName":"衢州市"
			}
		],
		"result":""
	},
	"msg":"查询成功"
}

const communityList = {
	"code":200,
	"data":{
		"list":[
			{
				"address":"",
				"bindingAddress":"",
				"bindingType":"",
				"bindingTypeName":"",
				"centerPhone":"",
				"cityCode":"14",
				"cityName":"杭州市",
				"clientType":"",
				"cloudTalkPassword":"",
				"code":"",
				"developerName":"",
				"domain":"lh",
				"enableAlramLocker":0,
				"enableThresholdElec":"",
				"enabledApp":"",
				"enabledAppName":"",
				"gateSentryType":"",
				"gateSentryTypeName":"",
				"holdTime":"",
				"homePageService":"",
				"homePageServiceName":"",
				"id":"1c3f1c2d2de54410ad7a861bf77a793a",
				"innerId":0,
				"latitude":"",
				"longitude":"",
				"name":"杭州春江彼岸",
				"noCLoseAlarm":0,
				"noOpenAlarm":0,
				"onCloudTalkService":"0",
				"onCloudTalkServiceName":"",
				"openingDate":"",
				"outerProjectId":"563",
				"projectFunc":[],
				"projectInitial":"",
				"projectType":"",
				"propertyInfoName":"",
				"propertyinfoId":"",
				"provinceCode":"11",
				"provinceName":"浙江省",
				"residentCount":0,
				"residentsCnt":0,
				"sentryCardType":"",
				"sentryCardTypeName":"",
				"sentryRole":"",
				"sentryRoleName":"",
				"servicePageService":"",
				"servicePageServiceName":"",
				"smartTalkPassword":"",
				"status":"5",
				"switchOffThreshold":0,
				"tenantId":"T014",
				"tenantName":"龙湖集团",
				"updateTime":"1571982542000"
			},
			{
				"address":"",
				"bindingAddress":"",
				"bindingType":"",
				"bindingTypeName":"",
				"centerPhone":"",
				"cityCode":"14",
				"cityName":"杭州市",
				"clientType":"",
				"cloudTalkPassword":"",
				"code":"",
				"developerName":"",
				"domain":"qd",
				"enableAlramLocker":0,
				"enableThresholdElec":"",
				"enabledApp":"",
				"enabledAppName":"",
				"gateSentryType":"",
				"gateSentryTypeName":"",
				"holdTime":"",
				"homePageService":"",
				"homePageServiceName":"",
				"id":"9978092d410c42f0abbb1785bedc5489",
				"innerId":563,
				"latitude":"",
				"longitude":"",
				"name":"杭州名景台(0701)",
				"noCLoseAlarm":0,
				"noOpenAlarm":0,
				"onCloudTalkService":"0",
				"onCloudTalkServiceName":"",
				"openingDate":"",
				"outerProjectId":"1941",
				"projectFunc":[],
				"projectInitial":"",
				"projectType":"",
				"propertyInfoName":"",
				"propertyinfoId":"",
				"provinceCode":"11",
				"provinceName":"浙江省",
				"residentCount":0,
				"residentsCnt":0,
				"sentryCardType":"",
				"sentryCardTypeName":"",
				"sentryRole":"",
				"sentryRoleName":"",
				"servicePageService":"",
				"servicePageServiceName":"",
				"smartTalkPassword":"",
				"status":"1",
				"switchOffThreshold":0,
				"tenantId":"T001",
				"tenantName":"千丁互联",
				"updateTime":"1569739936000"
			},
			{
				"address":"",
				"bindingAddress":"",
				"bindingType":"",
				"bindingTypeName":"",
				"centerPhone":"",
				"cityCode":"14",
				"cityName":"杭州市",
				"clientType":"",
				"cloudTalkPassword":"",
				"code":"",
				"developerName":"",
				"domain":"qd",
				"enableAlramLocker":0,
				"enableThresholdElec":"",
				"enabledApp":"",
				"enabledAppName":"",
				"gateSentryType":"",
				"gateSentryTypeName":"",
				"holdTime":"",
				"homePageService":"",
				"homePageServiceName":"",
				"id":"480e160bf1eb41ddb06c93e1cac86208",
				"innerId":243,
				"latitude":"",
				"longitude":"",
				"name":"杭州香醍溪岸(0701)",
				"noCLoseAlarm":0,
				"noOpenAlarm":0,
				"onCloudTalkService":"0",
				"onCloudTalkServiceName":"",
				"openingDate":"",
				"outerProjectId":"569",
				"projectFunc":[],
				"projectInitial":"",
				"projectType":"",
				"propertyInfoName":"",
				"propertyinfoId":"",
				"provinceCode":"11",
				"provinceName":"浙江省",
				"residentCount":0,
				"residentsCnt":0,
				"sentryCardType":"",
				"sentryCardTypeName":"",
				"sentryRole":"",
				"sentryRoleName":"",
				"servicePageService":"",
				"servicePageServiceName":"",
				"smartTalkPassword":"",
				"status":"1",
				"switchOffThreshold":0,
				"tenantId":"T001",
				"tenantName":"千丁互联",
				"updateTime":"1569739935000"
			},
			{
				"address":"",
				"bindingAddress":"",
				"bindingType":"",
				"bindingTypeName":"",
				"centerPhone":"",
				"cityCode":"14",
				"cityName":"杭州市",
				"clientType":"",
				"cloudTalkPassword":"",
				"code":"",
				"developerName":"",
				"domain":"qd",
				"enableAlramLocker":0,
				"enableThresholdElec":"",
				"enabledApp":"",
				"enabledAppName":"",
				"gateSentryType":"",
				"gateSentryTypeName":"",
				"holdTime":"",
				"homePageService":"",
				"homePageServiceName":"",
				"id":"4a7881e46bbc47a6980129c097a83d12",
				"innerId":251,
				"latitude":"",
				"longitude":"",
				"name":"杭州计划财务部(0701)",
				"noCLoseAlarm":0,
				"noOpenAlarm":0,
				"onCloudTalkService":"0",
				"onCloudTalkServiceName":"",
				"openingDate":"",
				"outerProjectId":"1810",
				"projectFunc":[],
				"projectInitial":"",
				"projectType":"",
				"propertyInfoName":"",
				"propertyinfoId":"",
				"provinceCode":"11",
				"provinceName":"浙江省",
				"residentCount":0,
				"residentsCnt":0,
				"sentryCardType":"",
				"sentryCardTypeName":"",
				"sentryRole":"",
				"sentryRoleName":"",
				"servicePageService":"",
				"servicePageServiceName":"",
				"smartTalkPassword":"",
				"status":"1",
				"switchOffThreshold":0,
				"tenantId":"T001",
				"tenantName":"千丁互联",
				"updateTime":"1569739935000"
			},
			{
				"address":"",
				"bindingAddress":"",
				"bindingType":"",
				"bindingTypeName":"",
				"centerPhone":"",
				"cityCode":"14",
				"cityName":"杭州市",
				"clientType":"",
				"cloudTalkPassword":"",
				"code":"",
				"developerName":"",
				"domain":"qd",
				"enableAlramLocker":0,
				"enableThresholdElec":"",
				"enabledApp":"",
				"enabledAppName":"",
				"gateSentryType":"",
				"gateSentryTypeName":"",
				"holdTime":"",
				"homePageService":"",
				"homePageServiceName":"",
				"id":"f095d8103f12489c9b90a87010f07c11",
				"innerId":4985,
				"latitude":"",
				"longitude":"",
				"name":"杭州原著(0701)",
				"noCLoseAlarm":0,
				"noOpenAlarm":0,
				"onCloudTalkService":"0",
				"onCloudTalkServiceName":"",
				"openingDate":"",
				"outerProjectId":"672",
				"projectFunc":[],
				"projectInitial":"",
				"projectType":"",
				"propertyInfoName":"",
				"propertyinfoId":"",
				"provinceCode":"11",
				"provinceName":"浙江省",
				"residentCount":0,
				"residentsCnt":0,
				"sentryCardType":"",
				"sentryCardTypeName":"",
				"sentryRole":"",
				"sentryRoleName":"",
				"servicePageService":"",
				"servicePageServiceName":"",
				"smartTalkPassword":"",
				"status":"1",
				"switchOffThreshold":0,
				"tenantId":"T001",
				"tenantName":"千丁互联",
				"updateTime":"1569739935000"
			},
			{
				"address":"",
				"bindingAddress":"",
				"bindingType":"",
				"bindingTypeName":"",
				"centerPhone":"",
				"cityCode":"14",
				"cityName":"杭州市",
				"clientType":"",
				"cloudTalkPassword":"",
				"code":"",
				"developerName":"",
				"domain":"qd",
				"enableAlramLocker":0,
				"enableThresholdElec":"",
				"enabledApp":"",
				"enabledAppName":"",
				"gateSentryType":"",
				"gateSentryTypeName":"",
				"holdTime":"",
				"homePageService":"",
				"homePageServiceName":"",
				"id":"8cf2e74bfa5647f9abb5b92f2e22309c",
				"innerId":5024,
				"latitude":"",
				"longitude":"",
				"name":"杭州滟澜星座",
				"noCLoseAlarm":0,
				"noOpenAlarm":0,
				"onCloudTalkService":"0",
				"onCloudTalkServiceName":"",
				"openingDate":"",
				"outerProjectId":"121",
				"projectFunc":[],
				"projectInitial":"",
				"projectType":"",
				"propertyInfoName":"",
				"propertyinfoId":"",
				"provinceCode":"11",
				"provinceName":"浙江省",
				"residentCount":0,
				"residentsCnt":0,
				"sentryCardType":"",
				"sentryCardTypeName":"",
				"sentryRole":"",
				"sentryRoleName":"",
				"servicePageService":"",
				"servicePageServiceName":"",
				"smartTalkPassword":"",
				"status":"1",
				"switchOffThreshold":0,
				"tenantId":"T001",
				"tenantName":"千丁互联",
				"updateTime":"1569739824000"
			},
		],
		"pageNo":1,
		"pageSize":100,
		"result":"",
		"totalCnt":18
	},
	"msg":"查询成功"
}

// 获取社区列表
Mock.mock(/\/api\/json\/projectApi\/findProjectListByLoginUser/, 'post', () => {
  return communityList
})

// 获取省列表
Mock.mock(/\/api\/json\/provinceCityApi\/getAllCityByLoginUser/, 'post', () => {
  return cityList
})

// 水电表日使用量
Mock.mock(/\/api\/json\/gyLogApi\/getWaterElecRecord/, 'post', () => {
  return dayUse
})
// 水电表单月累计使用量
Mock.mock(/\/api\/json\/gyLogApi\/getWaterElecCumulativeRecordCurrentMonth/, 'post', () => {
  return totalUser
})
// 下发门锁密码
Mock.mock(/\/api\/json\/gyLockApi\/addPassword/, 'post', () => {
  return pwdStatus
})
// 更新门锁密码
Mock.mock(/\/api\/json\/gyLockApi\/updatePassword/, 'post', () => {
  return pwdStatus
})
// 操作密码状态
Mock.mock(/\/api\/json\/gyLockApi\/statusPassword/, 'post', () => {
  return pwdStatus
})
// 密码详情
Mock.mock(/\/api\/json\/gyLockApi\/getLockPwdList/, 'post', () => {
  return pwdList
})
// 开锁记录
Mock.mock(/\/api\/json\/lockerLogApi\/getLockerOpenLogList/, 'post', () => {
  return openLockList
})
// 事件记录
Mock.mock(/\/api\/json\/deviceLogApi\/getDeviceLog/, 'post', () => {
  return logList
})

Mock.mock(/\/api\/json\/authUserApi\/modifyAuthUserPassword/, 'post', () => {
  return modifyPwd
})

Mock.mock(/\/api\/json\/ufoXcApi\/getInfoSummary/, 'post', () => {
  return overviewdata
})
Mock.mock(/\/api\/json\/ufoXcApi\/getPassingStatistic/, 'post', () => {
  return statisticData
})
Mock.mock(/\/api\/json\/ufoXcApi\/getVehicleFlowStatistic/, 'post', () => {
  return flowData
})

Mock.mock(/\/api\/json\/ufoXcApi\/getCityOrProjectPassingStatistic/, 'post', () => {
  return passingData
})
Mock.mock(/\/api\/json\/ufoXcApi\/getAlarmInfoStatistic/, 'post', () => {
  return alarmData
})
Mock.mock(/\/api\/json\/ufoXcApi\/getDeviceStatusStatistic/, 'post', () => {
  return iotData
})

Mock.mock(/\/api\/json\/ufoXcApi\/getDeviceStatusLineChart/, 'post', () => {
  return iotLineChartData
})

Mock.mock(/\/api\/json\/ufoXcApi\/getMapInfo/, 'post', () => {
  return mapInfo
})

Mock.mock(/\/api\/json\/ufoXcApi\/getPassingMonitorRecord/, 'post', () => {
  return passingRecord
})
Mock.mock(/\/api\/json\/ufoXcApi\/getPassMonitorStatisticCurrentDay/, 'post', () => {
  return passCurrentDay
})

Mock.mock(/\/api\/json\/ufoXcApi\/getPassMonitorStatisticMonth/, 'post', () => {
  return passMonth
})
Mock.mock(/\/api\/json\/ufoXcApi\/confirmMonitorRecord/, 'post', () => {
  return confirmMonitorRecord
})

Mock.mock(/\/api\/json\/ufoXcApi\/getAlarmMonitorRecord/, 'post', () => {
  return alarmRecord
})

Mock.mock(/\/api\/json\/ufoXcApi\/getAlarmMonitorStatisticCurrentDay/, 'post', () => {
  return alarmCurrentDay
})

Mock.mock(/\/api\/json\/ufoXcApi\/getAlarmMonitorStatisticMonth/, 'post', () => {
  return alarmMonth
})
Mock.mock(/\/api\/json\/ufoXcApi\/confirmAlarmInfo/, 'post', () => {
  return confirmAlarmInfo
})
Mock.mock(/\/api\/json\/buildApi\/getBuildListByProjectId/, 'post', () => {
  return buildList
})
Mock.mock(/\/api\/json\/platformDeviceApi\/getDeviceTypeList/, 'post', () => {
  return deviceTypeList
})

Mock.mock(/\/api\/json\/platformDeviceApi\/getDeviceList/, 'post', () => {
  return deviceList
})

export default Mock

