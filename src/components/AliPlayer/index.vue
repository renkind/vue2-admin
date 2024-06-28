<template>
	<div class="home">
		<div id="aliPlayer" ref="aliPlayer"></div>
	</div>
</template>

<script>
/* eslint-disable */ 
/*
    目前aliplayer没有提供npm库，直接在public/index.html进行引入  播放器文档：https://help.aliyun.com/document_detail/417512.html

      h5引入以下文件以减少体积
      https://g.alicdn.com/de/prismplayer/2.10.0/skins/default/aliplayer-min.css
      https://g.alicdn.com/de/prismplayer/2.10.0/aliplayer-h5-min.js

      PC引入以下文件实现环境自适应
      https://g.alicdn.com/de/prismplayer/2.10.0/skins/default/aliplayer-min.css"
      https://g.alicdn.com/de/prismplayer/2.10.0/aliplayer-min.js

      传参示例示例

      html:
        <AliPlayer :options="options" ref="player" />

      data:
        this.options = {
          id: "aliPlayer",
          cover: "https://file.dahe.cn/image/jpeg/20220729/1659078650758934.jpg", //视频封面
          // definition:"", //清晰度
          // source: 'https://rmfile.dahe.cn/video/mp4/20220726/1658822710446204.m3u8', //播放地址，可以是第三方点播地址，或阿里云点播服务中的播放地址。
          source: '//player.alicdn.com/video/editor.mp4', //播放地址，可以是第三方点播地址，或阿里云点播服务中的播放地址。
          isLive: false, // 直播是true 录播是false
          rePlay: false, // 重复播放
          playsinline: true, // 非全屏模式（即内联的方式）
          preload: true, // 播放器自动加载，目前仅H5可用。
          controlBarVisibility: "always", // 功能条显示方式 never 隐藏整个控制面板
          autoplay: false, // 自动播放
          useH5Prism: true, // 启用H5播放器
          ...
        }
  */
export default {
	name: "AliPlayer",
	data() {
		return {
			player: null
		};
	},
	props: {
		options: {
			type: Object,
			require: true
		},
		readyFn: {
			type: Function,
			require: false,
			default: (player) => {
				console.log(player);
				console.log("The player is created.");
			}
		}
	},
	mounted() {
		this.initPlayer();
	},
	methods: {
		// 获取播放器信息，提供父组件调用内置方法
		getPlayer() {
			return this.player;
		},
		// 初始化播放器组件
		initPlayer() {
			try {
				this.player = new Aliplayer(this.options, this.readyFn);
			} catch (error) {
				console.log(error);
				throw new Error("播放器初始化失败,请检查依赖是否正常引入");
			}
		},
		// 播放
		play() {
			console.log(this.player);
			this.player.play();
		},
		// 暂停
		pause() {
			this.player.pause();
		},
		// 重播
		replay() {
			this.player.replay();
		},
		// 获取当前时间
		getCurrentTime() {
			const timing = this.player.getCurrentTime();
			console.log(`已播放${timing}秒`);
		},
		// 获取播放状态
		getStatus() {
			const status = this.player.getStatus();
			console.log("getStatus:", status);
		},
		// 销毁
		destory() {
			this.player && this.player.dispose();
		}
	},
	beforeDestroy() {
		this.destory();
	}
};
</script>

<style scoped>
/* 修改播放按钮定位至播放器中心 */
/deep/.prism-player .prism-big-play-btn {
	left: calc(50% - 32px) !important;
	bottom: calc(50% - 32px) !important;
}
/* 隐藏字幕按钮 未找到配置项，使用样式隐藏 */
/deep/.prism-cc-btn {
	display: none;
}
</style>
