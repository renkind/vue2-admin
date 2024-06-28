<template>
	<div
		class="sidebar-logo-container"
		:class="{ collapse: collapse }"
		:style="{ backgroundColor: sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground }"
	>
		<transition name="sidebarLogoFade">
			<router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/home">
				<img v-if="logo" :src="logo" class="sidebar-logo" />
				<el-button v-if="ico" class="sidebar-logo" icon="el-icon-s-promotion" type="primary"></el-button>
				<div
					v-else
					class="sidebar-title"
					:style="{ color: sideTheme === 'theme-dark' ? variables.logoTitleColor : variables.logoLightTitleColor }"
				>
					{{ appTitle }}
				</div>
			</router-link>
			<router-link v-else key="expand" class="sidebar-logo-link" to="/home">
				<img v-if="logo" :src="logo" class="sidebar-logo" />
				<div
					class="sidebar-title"
					:style="{ color: sideTheme === 'theme-dark' ? variables.logoTitleColor : variables.logoLightTitleColor }"
				>
					{{ appTitle }}
				</div>
			</router-link>
		</transition>
	</div>
</template>

<script>
// import logoImg from "@/assets/logo/logo.png";
import ico from "@/assets/APPicon.jpg";
import variables from "@/assets/styles/variables.scss";
import appConfig from "@/config/app/index.js";
export default {
	name: "SidebarLogo",
	data() {
		return {
			logo: ico,
			ico: true, // 将 ico 属性添加到 data 选项，并初始化为 true
			appTitle: appConfig.appTitle
		};
	},
	props: {
		collapse: {
			type: Boolean,
			required: true
		}
	},
	computed: {
		variables() {
			return variables;
		},
		sideTheme() {
			return this.$store.state.settings.sideTheme;
		},
		logoIcon() {
			return "el-icon-s-promotion";
		}
	}
};
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
	transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
	opacity: 0;
}

.sidebar-logo-container {
	position: relative;
	width: 100%;
	height: 50px;
	line-height: 50px;
	background: #2b2f3a;
	text-align: center;
	overflow: hidden;

	& .sidebar-logo-link {
		height: 100%;
		width: 100%;

		& .sidebar-logo {
			display: inline-block !important;
			width: 56px;
			height: 56px;
			vertical-align: middle;
			// margin-right: 12px;
			padding: 8px;
			// background: white;
		}

		& .sidebar-title {
			display: inline-block;
			margin: 0;
			color: #fff;
			font-weight: 600;
			line-height: 50px;
			font-size: 14px;
			font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
			vertical-align: middle;
		}
	}

	&.collapse {
		.sidebar-logo {
			// 在折叠状态下隐藏图标
			display: none;
		}

		.sidebar-title {
			&.collapsed {
				display: inline-block;
			}
			display: none; // 在折叠状态下隐藏标题
		}
	}
}
</style>
