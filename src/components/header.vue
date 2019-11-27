<template>
  <div class="wrap-header">
    <header class="header" ref="header">
      <div class="main main-header">
        <div class="logo" @click="toHome">
            <img  class="logo-img" src="~@assets/img/logo.png" />
            <div class="logo-txt">
              <div class="logo-title" >千丁·云顶</div>
              <div class="logo-sub-title" >社区物联网开放平台</div>
            </div>
        </div>
        <div class="nav">
          <ul>
            <li :class="{'active': active == 'home'}">首页</li>
            <li>开发资源</li>
            <li @click="toPage('./document.html')">开发中心</li>
            <li @click="showPanel">登录</li>
          </ul>
        </div>
      </div>
    </header>
    <div class="header-bg flex-center">
      <img  class="header-img" src="~@assets/img/home/banner.png" />
      <div class="main main-bg">
        <div class="header-txt">从这里开始，<br /> 与千丁互联携手共创未来社区</div>
        <div class="btn-open">免费开通服务</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['title', 'back'],
  data() {
    return {
      active: 'home'
    }
  },
  mounted() {
    this.$nextTick(()=>{
      // 滚动监听
      window.addEventListener('scroll', this.handleScroll)
    })
  },

  methods: {
    handleScroll() {
      var $header = this.$refs.header
      if(window.pageYOffset >= 70){
        $header.classList.add('bg')
      } else {
        $header.classList.remove('bg')
      }
    },
    showPanel() {
      this.$emit('showLogin', true)
    },
    toHome() {
      if(window.location.pathname == '/' || window.location.pathname == '/index.html') return
      window.location.href = '/index.html'
    },
    toPage(path) {
      window.location.href = path
    }
  }
}
</script>

<style lang="less" scoped>  
.wrap-header{
  width: 100%;
}
.main{
  width: 1200px;
  margin: auto;
}

.header{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;

  font-size:16px;
  font-weight:400;
  color:rgba(255,255,255,1);
  &.bg{
    background: #47525B;
  }
  .main-header{
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .logo{
    cursor: pointer;
    display: flex;
    align-items: center;
    .logo-img{
      margin-right: 10px;
      width: 36px;
      height: 36px;
    }
    .logo-title{
      font-size: 16px;
    }
    .logo-sub-title{
      font-size: 15px;
      color: #ccc;
    }
  }
  .nav ul{ 
    display: flex;
    justify-content: space-between;
    list-style: none;

    li{
      cursor: pointer;
      padding: 0 20px;
      color: #c5c8ce;
      &:hover{ 
        color:#ececec;
      }
      &.active{
        color: #fff;
      }
    }
  }
}

.header-bg{
  position: relative;
  z-index: 9;
  width: 100%;
  .block{
    width: 100%;
    height: 22.5%;
  }
  .header-img{
    position: relative;
    z-index: -1;
    width: 100%;
  }
  .main-bg{
    position: absolute;
    top: 43%;
    left: 0;
    right: 0;
    transform: translate(0, -57%)
  }
  .header-txt{
    font-size:40px;
    font-weight:600;
    color:rgba(255,255,255,1);
    line-height:56px;
  }
  .btn-open{
    cursor: pointer;
    margin-top: 64px;
    text-align: center;
    width:200px;
    height:60px;
    line-height: 60px;
    background:rgba(0,134,255,1);
    border-radius:40px;

    color:rgba(255,255,255,1);
    font-size:20px;
    transition: .3s;
    &:hover {
      cursor: pointer;
      transform: scale(1.02);
    }
  }
}
</style>