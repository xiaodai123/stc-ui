<template>
    <div example-demo>
		<div class="example-demo-source">
			<slot name="source"></slot>
			<span class="example-demo-code-icon" v-if="!$slots.default" @click="showCode=!showCode">
				<stc-svg-icon class="code-expand-icon-show" name="expand-code" fill="#454D58" width="12" height="12" />
			</span>
		</div>
		<div class="example-demo-meta" v-if="$slots.default">
			<slot></slot>
			<span v-if="$slots.default" class="example-demo-code-icon" @click="showCode=!showCode">
				<stc-svg-icon class="code-expand-icon-show" name="expand-code" fill="#454D58" width="12" height="12" />
			</span>
		</div>
		<div class="example-demo-code" v-show="showCode">
			<slot name="highlight"></slot>
		</div>
    </div>
</template>
<script>
export default {
    name: 'ExampleDemo',
    data() {
        return {
            showCode: false
        };
    }
};
</script>
<style lang="scss">
div[example-demo] {
	border: 1px solid #d8dce0;
	border-radius: 2px;
	display: inline-block;
	width: 100%;
	position: relative;
	margin: 0 0 16px;
	-webkit-transition: all 0.2s;
	transition: all 0.2s;
	border-radius: 2px;
	p {
		padding: 0;
		margin: 0;
	}
	.example-demo-source {
		border-bottom: 1px solid #d8dce0;
		padding: 20px 24px 20px;
		color: #444;
		position: relative;
		margin-bottom: -1px;
	}
	.example-demo-code-icon {
		position: absolute;
		right: 16px;
		bottom: 14px;
		cursor: pointer;
		width: 18px;
		height: 18px;
		line-height: 18px;
		text-align: center;
	}
	.example-demo-meta {
		position: relative;
		padding: 12px 50px 12px 20px;
		border-radius: 0 0 2px 2px;
		-webkit-transition: background-color 0.4s;
		transition: background-color 0.4s;
		width: 100%;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		font-size: 14px;
		color: #444;
		font-size: 14px;
		line-height: 2;
		border-radius: 0;
		border-bottom: 1px dashed #d8dce0;
		margin-bottom: -1px;
		code {
			color: #444;
			background-color: #e6effb;
			margin: 0 4px;
			display: inline-block;
			padding: 3px 7px;
			border-radius: 3px;
			height: 18px;
			line-height: 18px;
			font-family: Menlo, Monaco, Consolas, Courier, monospace;
			font-size: 14px;
		}
	}
	.example-demo-code {
		background-color: #e0dcdc;
		font-size: 0;
		code {
			background-color: #e0dcdc;
			font-family: Consolas, Menlo, Courier, monospace;
			border: none;
			display: block;
			font-size: 14px;
			padding: 16px 32px;
		}
		pre {
			margin: 0;
			padding: 0;
		}
	}
}
</style>