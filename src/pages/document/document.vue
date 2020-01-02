<template>
  <div class="body">
    <qd-header @showLogin="showLogin" />

    <div class="wrap-main">
      <div class="aside">
        <div class="menu" >
          <div class="sub-menu open">
            <div class="parent-item hasChildren" @click="openMenu">
              开发指南
            </div>
            <div class="menu-item" @click="activeMenu($event, '1-1')">平台简介</div>
            <div class="menu-item" @click="activeMenu($event, '1-2')">资质认证</div>
            <div class="menu-item" @click="activeMenu($event, '1-3')">服务接入</div>
          </div>

          <div class="sub-menu">
            <div class="parent-item hasChildren" @click="openMenu">
              API文档
            </div>
            <div class="menu-item" @click="activeMenu($event, '2-1')">使用指南</div>
            <div class="menu-item" @click="activeMenu($event, '2-2')">调用方式</div>
            <div class="menu-item" @click="activeMenu($event, '2-3')">签名机制</div>
            <div class="menu-item" @click="activeMenu($event, '2-4')" >登录鉴权</div>

            <div class="menu-item" @click="activeMenu($event, '2-5')">设备管理</div>
            <div class="menu-item" @click="activeMenu($event, '2-6')">服务管理</div>
            <div class="menu-item" @click="activeMenu($event, '2-7')" >错误码</div>
          </div>
          
          <div class="sub-menu">
            <div class="parent-item" @click="openMenu($event, '3')">
              协议文档
            </div>
          </div>

          <div class="sub-menu">
            <div class="parent-item" @click="openMenu($event, '4')">
              规范文档
            </div>
          </div>
          <div class="sub-menu">
            <div class="parent-item" @click="openMenu($event, '5')">
              常见问题
            </div>
          </div>
        </div>
      </div>

      <div class="main" v-show="documentId =='1-1'">
        <div class="sub-title1">平台简介</div>
        <p>千丁云顶是针对智能生活、智慧社区、智能家居以及商业共享等领域提供各种行业SAAS应用、AIoT云对接、APP物联网统一服务平台。致力于实现社区场景智慧连接，为物联网生态伙伴提供云端一体化、安全稳定统一的接入解决方案；    通过千丁云顶提供的开放能力帮助生态合作伙伴更快捷、高效的接入到各类社区的物联网应用场景，为生态伙伴更进一步提高竞争能力。
        </p>
        <p>千丁云顶开放平台为开发者和生态合作伙伴提供完整的接入千丁生态解决方案，包括物联网开发平台、丰富的OpenAPI、完善的产品文档，以及相应的技术支持与配套服务。
        </p>
      </div>

      <div class="main" v-show="documentId =='1-2'">
        <div class="sub-title1">资质认证</div>
        <div class="sub-title2">1.登录平台</div>
        <p>进入千丁云顶开放平台官网（https://open.iot.qdingnet.com），【登录】按钮进入账号登录页面。</p>
        <div class="wrap-img">
          <img class="login-img"
            src="~@assets/img/open-platform/login.png" />
        </div>
        <div class="sub-title2">2.接入资质认证</div>
        <div class="sub-title3">2.1 填写资料</div>
        <p>您需要填写开发者联系方式、公司信息，提交后进行资质审核，如审核未通过，您需要重新填写并提交;</p>
        <div class="sub-title3">2.2 联系方式:</div>
        <p>联系方式包含:联系人姓名、手机号码、短信验证码、邮箱、联系地址;</p>
        <div class="sub-title3">2.3 公司信息</div>
        <p>公司信息包含：公司名称、营业执照注册号、法人姓名、营业执照照片；</p>
        <p>温馨提示:
          公司信息包含：公司名称、营业执照注册号、法人姓名、营业执照照片；
          填写联系人姓名，手机号码，进行手机短信验证码校验，如未接收到短信验证码，可重试进行获取;
          注意填写有效邮箱，用于接受平台审核通知等重要消息;
          注意填写有效地址，用于联系您和回寄纸质协议等;
          照片上传要求:照片不得大于 2M，且仅限于 jpg 和 png 格式;
          我司资质验证系统已于工商部门联网，请勿提供虚假证件。如下
        </p>
        <div class="wrap-img">
          <img class="login-img"
            src="~@assets/img/open-platform/data.png" />
        </div>
        <div class="sub-title3">2.4 获取iot_secret密钥</div>
        <p>申请资料提交后，千丁系统管理会审核开发者提交的资料。审核通过后，系统会把通讯秘钥iot_secret发邮件到开发提交邮件中。开发通过这个秘钥实现千丁云顶IOT平台进行对接。
        </p>
      </div>

      <div class="main" v-show="documentId =='1-3'">
        <div class="sub-title1">服务接入</div>
        <p>服务接入的流程为:</p>
        <div class="wrap-img">
          <img class="login-img"
            src="~@assets/img/open-platform/step.png" />
        </div>
        <p>第三方厂商使用用户名与秘钥调用qdh-cloud-web/api/json/access/accessToken接口，获取到token信息后，可以API接口对接千丁星宸平台。</p>
      </div>

      <div class="main" v-show="documentId =='2-1'">
        <div class="sub-title1">使用指南</div>
      </div>

      <div class="main" v-show="documentId =='2-2'">
        <div class="sub-title1">调用方式</div>
        <div class="sub-title2">1.服务地址</div>
        <p>本文档列举了千丁云顶可提供的全部 API 功能，但是在具体项目中，对接使用的 API 接口应该是 API 文档中的部分接口，开发者可以查看平台可使用的API 接口列表，通过指定域名访问，在实际项目对应的环境中进行联调。</p>
        <table>
          <thead><tr><td>类别</td><td>域名</td></tr></thead>

          <tbody><tr><td>公有云环境</td><td>open.iot.qdingnet.com</td></tr></tbody>
        </table>

        <div class="sub-title2">2.通信协议</div>
        <p>千丁云顶提供的所有API接口均通过HTTPS协议传输，提供高安全性的通讯。</p>

        <div class="sub-title2">3.请求方法</div>
        <p>千丁支持的HTTP请求方法：<br />采用json作为content-type用于数据的传输并采用post方式进行数据提交。字符编码为UTF-8.</p>
      
        <div class="sub-title2">4.公共参数</div>
        <p>公共参数用于标识接口鉴权的参数，每次请求均需要携带这些参数，才能正常发起请求。</p>
        <table>
          <thead><tr><td>参数</td><td>参数描述</td></tr></thead>
          <tbody>
            <tr>
              <td>token</td>
              <td>访问令牌，用于后续接口的接入访问，时效为5小时，请注意及时更新令牌</td>
            </tr>
            <tr>
              <td>signature</td>
              <td>签名结果</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="main" v-show="documentId =='2-3'">
        <div class="sub-title1">签名机制</div>
        <div class="sub-title2">1.签名机制简介</div>
        <p>千丁云顶HTTP API 使用签名机制来验证请求的合法性。应用在调用千丁API时必须要带上接口请求签名。IOT安全云采用非对称方式进行签名验签，当前算法采用Sha256WithRSA，业务方采用RAS2048方式进行公私钥的生成，对于校验不通过的请求，API将拒绝处理，并返回鉴权失败错误。</p>

        <div class="sub-title2">2.生成算法</div>
        <p>public static KeyPair generateKeyPair() throws Exception {
              KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
              generator.initialize(2048, new SecureRandom());
              KeyPair pair = generator.generateKeyPair();
              System.out.println("pubkey:" + Base64.getEncoder().encodeToString(pair.getPublic().getEncoded()));
              System.out.println("prikey:" + Base64.getEncoder().encodeToString(pair.getPrivate().getEncoded()));
              return pair;
          }
        </p>

        <p>生成的公钥同步给千丁云顶平台，私钥请妥善保管，后续将采用此公钥进行验签。千丁云顶平台的回调将采用IoT安全平台的私钥进行加签，业务方采用相同算法利用平台公钥进行验签，平台公钥如下：
        </p>
        <p>MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvntoXjGysUxK7galWjS+QFszfefdXv1moD/cS1Z6cazoUmpl81RVy6S05c/ToZUupHA6Sfv86SMgJ6dYKkBDz0fY07RGPywI8yFsw9y2wleeKNp3nEeUIHIWwhIS3eKM4v1S+3Hqn0/QXKHdkTJWSuyEyG+jxyto4RJiMib2wkh+saZKnWaqczqAx6JzD07hSW8j8zMz0v3vcHW3ezsN+RYsZQzGHbCFA1KLW4il+ycaMEYLnJcNtwbh2v3z2nRd3ig6ZHYIMOUgDFvdTalCp0ZfpEAS4uhMZVoxZgFKUuPC8TYaKswSFP8eJo0mJGXxOCld51InJD5tYqBVWzKYxQIDAQAB<br/>
        </p>
        <p>签名时生成签名原文的算法如下，将请求报文中param结构中的字段按照字段名字典序升序排列将字段值进行首尾相接，,如果是多层结构则按照递归升序进行排列拼接，拼接完成后在字符串末尾加入时间戳，签名原文生成逻辑如下:
        </p>

        <p>private static final String EMPTY_STRING = "";

          public static String createSignPlainText(Object object, Long timestamp) throws IllegalAccessException {
                  return createSignPlainText(object) + timestamp;
              }
              public static String createSignPlainText(Object object) throws IllegalAccessException {
                  if (object == null) {
                      return EMPTY_STRING;
                  }
                  if (object.getClass().isArray()) {
                      return createArraySignPlainText(object);
                  } else if (object instanceof Map) {
                      return createMapSignPlainText(object);
                  } else if (object instanceof Collection) {
                      return createCollectionSignPlainText(object);
                  } else if (object instanceof Number) {
                      return object.toString();
                  } else if (object instanceof String) {
                      return object.toString();
                  } else if (object instanceof Date) {
                      DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                      return dateFormat.format((Date) object);
                  } else if (object instanceof Enum) {
                      return ((Enum) object).name();
                  } else if (object instanceof Boolean) {
                      return object.toString();
                  }else {
                      return createObjectSignPlainText(object);
                  }
              }
          
              private static String createArraySignPlainText(Object object) throws IllegalAccessException {
                  StringBuilder plainText = new StringBuilder();
                  int length = Array.getLength(object);
                  for (int i = 0; i < length; i++) {
                      Object element = Array.get(object, i);
                      plainText.append(createSignPlainText(element));
                  }
                  return plainText.toString();
              }
          
              private static String createMapSignPlainText(Object mapObject) throws IllegalAccessException {
                  StringBuilder plainText = new StringBuilder();
                  TreeMap treeMap = new TreeMap<>(String::compareTo);
                  treeMap.putAll((Map) mapObject);
                  plainText.append(createCollectionSignPlainText(treeMap.values()));
                  return plainText.toString();
              }
          
              private static String createCollectionSignPlainText(Object collection) throws IllegalAccessException {
                  StringBuilder plainText = new StringBuilder();
                  for (Object object : (Collection) collection) {
                      plainText.append(createSignPlainText(object));
                  }
                  return plainText.toString();
              }
          
              private static String createObjectSignPlainText(Object object) throws IllegalAccessException {
                  Field[] fields = object.getClass().getDeclaredFields();
                  List fieldList = Arrays.stream(fields).sorted(Comparator.comparing(Field::getName)).collect(Collectors.toList());
                  StringBuilder plainText = new StringBuilder();
                  for (Field field : fieldList) {
                      field.setAccessible(true);
                      Object value = field.get(object);
                      if (value == null) {
                          continue;
                      }
                      plainText.append(createSignPlainText(value));
                  }
                  return plainText.toString();
              }
        </p>

        <p>原文生成示例，请求数据结构如下，为了表述对象方便采用json结构进行表示：</p>

        <p>body:{
            “param”:{"id":"5d3ac8d245ce09927536e0c6",
            "sn":"03c3ec096786415fad62b4def4e36e46",
            "devLocation":[{
              "projectId":"90d45aed1ed149679271613847b050fd",
              "aptmUuid":"001001001010012"
            }]},
              "timestamp":1555553652723
          }
        </p>

        <p>生成原文如下：<br />0010010010100125d3ac8d245ce09927536e0c690d45aed1ed149679271613847b050fd03c3ec096786415fad62b4def4e36e461555553652723<br />签名算法如下：
        </p>
        <p>
          `private static final String SHA256_WITH_RSA = "SHA256withRSA";
          
          public static String sign(String plainText, String privateKeyBase64) throws Exception {
              RSAPrivateKey rsaPrivateKey = RSAPrivateCrtKeyImpl.newKey(Base64.getDecoder().decode(privateKeyBase64));
              return sign(plainText, rsaPrivateKey);
          }

          public static String sign(String plainText, PrivateKey privateKey) throws Exception {
              Signature privateSignature = Signature.getInstance(SHA256_WITH_RSA);
              privateSignature.initSign(privateKey);
              privateSignature.update(plainText.getBytes(StandardCharsets.UTF_8));
              byte[] signature = privateSignature.sign();
              return Base64.getEncoder().encodeToString(signature);
          }

          public static boolean verify(String plainText, String signature, String publicKeyBase64) throws Exception {
              RSAPublicKeyImpl publicKey = new RSAPublicKeyImpl(Base64.getDecoder().decode(publicKeyBase64));
              boolean verifyResult = verify(plainText, signature, publicKey);
              LogUtil.info(logger, "#DSV# method:RSA signature:{} plaintext:{} publicKey:{} result:{}", signature, plainText, publicKeyBase64, verifyResult);
              return verifyResult;
          }

          public static boolean verify(String plainText, String signature, PublicKey publicKey) throws Exception {
              Signature publicSignature = Signature.getInstance(SHA256_WITH_RSA);
              publicSignature.initVerify(publicKey);
              publicSignature.update(plainText.getBytes(StandardCharsets.UTF_8));
              byte[] signatureBytes = Base64.getDecoder().decode(signature);
              return publicSignature.verify(signatureBytes);
          }`
        </p>
      </div>

      <div class="main" v-show="documentId =='2-4'">
        <div class="sub-title1">登录鉴权</div>
        <div class="sub-title2">1.获取令牌</div>
        <p>合作厂商对接千丁云顶平台时，需要向千丁申请appAccount（合作商账号），appSecret(密钥)；申请成功后调用接口生成token。开发者可以使用千丁云顶平台平台分配的appAccount与appSecret获取token，token有效时长为5小时

          接口：{url}/qdh-cloud-web/api/json/access/accessToken

          描述：用于获取token

          请求方法：POST

          请求参数格式：
          body:{
            "param":{
              "appAccount":"String 合作商账号",
              "appSecret":"test 合作商密码"
            },
            "timestamp":number 时间戳精确到毫秒
            "signature": "string签名结果，参照附录签名验签逻辑"
          }

          返回报文格式：
          {
            "code":200,
            "data":{
              "expiresIn":token有效期,
              "success":获取成功或者失败 true/false,
              "token":"生成的token"
            },
            "msg":""
          }
        </p>
      </div>

      <div class="main" v-show="documentId =='2-5'">
        <div class="sub-title1">设备管理</div>
        <div class="sub-title2">1.设备注册</div>
        <p>接口：{url}/qdh-cloud-web/api/json/platformDeviceApi/registerDeviceInfo

          描述：用于进行设备注册

          请求方法：POST

          请求参数格式：
          body: {
            "param": {
              "deviceCode": "String 设备型号",
              "deviceMac": "String 设备mac地址",
              "deviceName": "String 设备名称",
              "deviceSn": "String 设备序列号",
              "deviceUuid": "String 设备id",
              "firmwareVersion": "String 设备固件版本号",
              "status": "String 设备状态",
              "sysType": "String 设备类型-由开放平台指定"
            },
            "timestamp":number 时间戳精确到毫秒,
            "signature":"String 签名结果，参照签名机制"
          }

          返回报文格式：
          {
            "code":200,
            "data":{
              "result":"1000 执行失败 1001 执行成功",
              "qdCloudId":"string 设备在千丁开放平台注册的唯一id"
            },
            "msg":""
          }
        </p>

        <div class="sub-title2">2.获取设备列表</div>
        <p>接口：{url}/qdh-cloud-web/api/json/platformDeviceApi/getDeviceList

          描述：用于进行厂家设备列表的获取

          请求方法：POST

          请求参数格式：
          body: {
            "param": {
              "deviceSn": "String 设备序列号 可空",
              "qdCloudId": "String 设备在千丁开放平台的唯一标志 可空",
              "pageNo":int 当前页码
              "pageSize":每页记录数,最大返回100
            },
            "timestamp":number 时间戳精确到毫秒,
            "signature":"String 签名结果，参照签名机制"
          }

          返回报文格式：
          {
            "code":200,
            "data":{
              "deviceList":{
                "devinceSn":"string 设备sn号",
                "qdCloudId":"string 千丁开放平台唯一id",
                "deviceStatus":"string 设备状态 0 离线 1 在线",
                "location":{
                  "projectName":"string 所在社区",
                  "groupName":"string 所在期",
                  "buildName":"string 所在楼栋",
                  "unitName":"string 所在单元",
                  "roomName":"string 所在房号"
                },
                "deviceName":"string 设备名称"
              },
              "pageNo":number 当前页数,
              "pageSize":number 每页显示数量
              "total":number 总数量
            },
            "msg":""
          }
        </p>

        <div class="sub-title2">3.获取设备状态</div>
        <p>接口：{url}/qdh-cloud-web/api/json/platformDeviceApi/getDeviceStatus

          描述：获取当前设备是否可用

          请求方法：POST

          请求参数格式：
          body: {
            "param": {
              "deviceSn": "String 设备序列号",
            },
            "timestamp":number 时间戳精确到毫秒,
            "signature":"String 签名结果，参照签名机制"
          }

          返回报文格式：
          {
            "code":200,
            "data":{
              "devinceSn":"string 设备sn号",
              "deviceStatus":"string 设备状态 0 离线 1 在线"
            },
            "msg":""
          }
        </p>

        <div class="sub-title2">4.设备状态上报</div>
        <p>接口：{url}/qdh-cloud-web/api/json/platformDeviceApi/updateDeviceStatus

          描述：更新设备的状态

          请求方法：POST

          请求参数格式：
          body: {
            "param": {
              "deviceSn": "String 设备序列号",
          "deviceStatus": "String 设备状态 0 离线 1 在线",
            },
            "timestamp":number 时间戳精确到毫秒,
            "signature":"String 签名结果，参照签名机制"
          }

          返回报文格式：
          {
            "code":200,
            "data":{
              "result":"1000 执行失败 1001 执行成功"
            },
            "msg":""
          }
        </p>
      </div>

      <div class="main" v-show="documentId =='2-6'">
        <div class="sub-title1">服务管理</div>
      </div>

      <div class="main" v-show="documentId =='2-7'">
        <div class="sub-title1">错误码</div>
        <div class="sub-title2">1.HTTP错误码</div>
        <table>
          <thead><tr><td>错误码</td><td>含义</td></tr></thead>
          <tbody>
            <tr><td>400</td><td>请求不合法，包体格式错误</td></tr>
            <tr><td>403</td><td>禁止访问</td></tr>
            <tr><td>404</td><td>请求失败</td></tr>
            <tr><td>500</td><td>服务器内部错误</td></tr>
            <tr><td>501</td><td>服务未实现</td></tr>
            <tr><td>502</td><td>网关错误，服务不可用</td></tr>
            <tr><td>503</td><td>服务不可用</td></tr>
            <tr><td>504</td><td>后端服务不可用或者处理超时</td></tr>
          </tbody>
        </table>
        <div class="sub-title2">2.业务错误码</div>
        <table>
          <thead><tr><td>错误码</td><td>含义</td></tr></thead>
          <tbody>
            <tr><td>1000</td><td>执行失败</td></tr>
            <tr><td>1001</td><td>执行成功</td></tr>
            <tr><td>7000001</td><td>登录用户或者密码错误</td></tr>
            <tr><td>7000002</td><td>签名不允许为空</td></tr>
            <tr><td>7000003</td><td>签名校验失败</td></tr>
            <tr><td>7000004</td><td>设备不存在</td></tr>
          </tbody>
        </table>
      </div>

      <div class="main" v-show="documentId =='3'">
        <div class="sub-title1">协议文档</div>
        <table>
          <thead><tr><td>协议名称</td><td>版本号</td><td>发布时间</td><td>操作</td></tr></thead>
          <tbody>
            <tr><td>水表通讯协议</td><td>1.4</td><td>2019.7.5</td><td></td></tr>
            <tr><td>电表通讯协议</td><td>1.4</td><td>2019.7.5</td><td></td></tr>
            <tr><td>门锁通讯协议</td><td>1.4</td><td>2019.7.5</td><td></td></tr>
          </tbody>
        </table>
      </div>

      <div class="main" v-show="documentId =='4'">
        <div class="sub-title1">规范文档</div>
        <div class="sub-title2">一.审核说明</div>
        <p>本文主要介绍接入千丁云顶开放平台的第三方应用上线审核的标准，建议开发者在提交发布申请之前，按照该规范进行自测与检查，以便能够快速通过审核。</p>

        <div class="sub-title2">二.审核周期</div>
        <p>应用开发完成后，请开发者进行自测，检查完成后，开发者在应用发布页面可以“提交审核”。从千丁云顶开放平台团队收到完整的产品资料开始计算，一般需要5~10个工作日完成全部审核工作，请您耐心等待。

          由于不同应用在审核过程中，发现问题的数量及严重性不同，在审核过程中需要与您多次沟通，协助您完善产品资料并完成二次检查，因此审核时间会根据实际情况调整，请您理解和支持。

          通常我们会在开始审核后的5个工作日内，进行第一轮的反馈，如果您的应用发布申请被驳回，我们会通过短信、电话、邮件、站内信等方式告知被驳回的原因。</p>
        <div class="sub-title2">三.审核内容</div>
        <p>审核内容包括：规范性审核、产品文档审核、测试报告审核。具体审核内容，请参见下文详细描述。

          特别说明
          为保障接入千丁云顶开放平台的应用质量，建议您不要在应用发布审核通过之前对外售卖。审核过程及结果不会由于产品已对外售卖、正在量产等原因而进行特殊优先处理或破格审核通过。为了避免不必要的麻烦，请您在应用接入千丁云顶开放平台进行调试阶段，及时提交审核材料，并配合我们的建议完成修改，审核通过后再对外宣传、量产或售卖。

          3.1规范性审核
          为保障用户体验与接入产品的规范性，以下规范性审核适用于所有类型的应用。请您在提交审核前自行检查。

          3.1.2. APPID 使用规范
          (1). APPID代表应用唯一标识，同一公司的不同应用使用同一个APPID 将被拒绝；
          (2). APPID 私下授权给其他未获得接入资格的公司，该产品的使用将被拒。
          3.1.3.产品介绍规范
          (1). 产品介绍以本产品的功能介绍为主；
          (2). 产品介绍需要与实际的产品功能相符；
          (3). 产品介绍中不得含有与本产品无关的推广信息，不允许包含非法链接。

          3.2.产品文档审核
          产品说明书应符合以下规范：
          (1). 产品说明应提供最终用户可调用的功能和服务的描述，要求与实际情况一致，并且可以验证或测试；
          (2). 产品说明应规定将该软件应用投入使用所依赖的运行环境，包括硬件配置和软件配置；
          (3). 当有软件组件的选项和版本时，应予指明；
          (4). 产品说明应标识出所调用的云顶OpenAPI接口；
          (5). 产品说明应标明该软件应用是否提供维保，如果提供维护，则产品说明应陈述所提供的维护服务。

          3.3.测试报告审核
          测试报告应符合以下规范：
          (1). 测试报告需提供可供第三方审核的完整报告，内容包括但不限于测试目的、测试环境与配置、测试方法与工具、测试内容和执行情况、缺陷统计与分析、测试结论与建议等；
          (2). 测试报告应包括业务应用与云顶对接部分的安全测试内容，并达到腾讯云顶的安全标准；
          (3). 测试报告应选择该软件应用的最新的、稳定的版本作为测试对象；
          (4). 在条件许可下，应提供可用于第三方审核及验收的测试环境。</p>
      </div>

      <div class="main" v-show="documentId =='5'">
        <div class="sub-title1">常见问题</div>
      </div>
    </div>
    <qd-login ref="login" />
  </div>
</template>

<script>
/* eslint-disable */
import qdHeader from './component/header.vue'
import qdLogin from '@components/login.vue'

export default {
  data() {
    return {
      documentId: '1-1'
    }
  },
  components: {
    qdHeader,
    qdLogin
  },
  mounted() {
  },
  methods: {
    showLogin(val) {
      this.$refs.login.showLogin = val
    },
    openMenu(e, id) {
      this.documentId = id
      let $el = e.target.parentNode
      const $elList = $el.parentNode.parentNode.querySelectorAll('.active')
      for (let el of $elList){
        el.classList.remove('active')
      }
      e.target.classList.toggle('active')
      $el.classList.toggle('open')
    },
    activeMenu(e, id) {
      this.documentId = id
      const $el = e.target
      const $elList = $el.parentNode.parentNode.querySelectorAll('.active')
      for (let el of $elList){
        el.classList.remove('active')
      }
      $el.classList.add('active')
    },
  }
}
</script>
<style lang="less" scoped>
.body {
  background: #F4F4F4;
  min-width: 1200px;
  overflow-x: auto;
  min-height: 100%;
  color:rgba(0,0,0,0.8);
  .wrap-main {

    padding-top: 104px;
    min-height: 100%;
    max-width: 1440px;
    margin: auto;

    display: flex;
    align-items: flex-start;
    .aside {
      background: #fff;
      width: 281px;
      margin-right: 24px;

      padding-bottom: 114px;
      .menu{
        line-height: 56px;
        .sub-menu{
          border-bottom: 1px solid rgba(0,0,0,0.08);
          .parent-item{
            padding-left: 24px;
            position: relative;
            &.hasChildren{
              &::after{
                content: '';
                position: absolute;
                right: 24px;
                top: 50%;

                width: 0; 
                height: 0;
                border-width: 4px;
                border-style: solid;
                border-color: transparent rgba(0, 0, 0, 0.4) transparent transparent;
                transform: translate(0%, -50%) rotate(-90deg);

              }
            }
          }
          .menu-item{
            display: none;
            padding-left: 40px;
            height: 44px;
            line-height: 44px;
          }
          .active{
            color:rgba(255,255,255,1);
            background:rgba(13,143,255,1);
          }
          &.open{
            .menu-item{
              display: block;
            }
          .parent-item{
            &::after{
              transform: translate(0%, -50%) rotate(90deg);
            }
          }
          }

        }
      }
    }
    .main {
      min-height: 100%;
      padding: 32px;
      background: #fff;
      flex: 1;

      background:#fff;
      box-shadow:0px 0px 8px 0px rgba(0,0,0,0.04);
      border-radius:2px;

      .sub-title1{
        font-size:24px;

        font-weight:600;
        color:rgba(0,0,0,0.8);
        margin-bottom: 40px;
      }

      .sub-title2{
        font-size:20px;

        font-weight:600;
        color:rgba(0,0,0,0.8);
        margin-bottom: 40px;
      }

      .sub-title3{
        font-size:16px;

        font-weight:600;
        color:rgba(0,0,0,0.8);
        margin-bottom: 40px;
      }
      p{
        text-align: justify;
        line-height:24px;
        margin-bottom:20px;

        white-space: pre-wrap;
        word-break: break-word;
      }
      .wrap-img{
        text-align: center;
        .login-img{
          width: 600px;
        }
      }

      table{
        margin-bottom:20px;
        width: 100%;
        tr td{
          padding: 0 8px;
          height: 48px;
          border: 1px solid #ccc;
        }
      }
    }
  }
}
</style>
