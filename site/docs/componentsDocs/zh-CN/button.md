# Button

## 基本用法

基础的按钮用法。

:::demo 使用`type`、`plain`、`round`和`circle`属性来定义 Button 的样式。

```
<div>
  <stc-button>默认按钮</stc-button>
  <stc-button type="primary">查询</stc-button>
  <stc-button type="success">成功按钮</stc-button>
  <stc-button type="info">信息按钮</stc-button>
  <stc-button type="warning">警告按钮</stc-button>
  <stc-button type="danger">危险按钮</stc-button>
</div>

<div>
  <stc-button plain>朴素按钮</stc-button>
  <stc-button type="primary" plain>查询</stc-button>
  <stc-button type="success" plain>成功按钮</stc-button>
  <stc-button type="info" plain>信息按钮</stc-button>
  <stc-button type="warning" plain>警告按钮</stc-button>
  <stc-button type="danger" plain>危险按钮</stc-button>
</div>

<div>
  <stc-button round>圆角按钮</stc-button>
  <stc-button type="primary" round>查询</stc-button>
  <stc-button type="success" round>成功按钮</stc-button>
  <stc-button type="info" round>信息按钮</stc-button>
  <stc-button type="warning" round>警告按钮</stc-button>
  <stc-button type="danger" round>危险按钮</stc-button>
</div>

<div>
  <stc-button circle>
  	<stc-svg-icon name="search" width="14" height="14" />
  </stc-button>
  <stc-button type="primary" circle>详</stc-button>
  <stc-button type="success" icon="check" circle></stc-button>
  <stc-button type="info" circle>账</stc-button>
  <stc-button type="warning" circle>属</stc-button>
  <stc-button type="danger" icon="delete" circle></stc-button>
</div>
```

:::

### 分页按钮

没有边框和背景色的按钮。

:::demo 没有边框和背景色的按钮

```
<stc-button icon="left"  circle></stc-button>
1/2
<stc-button icon="right" size="small" circle></stc-button>
```

:::

### 文字按钮

没有边框和背景色的按钮。

:::demo 没有边框和背景色的按钮

```
<stc-button type="text" icon="doubleleft">返回</stc-button>
<stc-button type="text" disabled>返回</stc-button>
```

:::

### 禁用状态

按钮不可用状态。

:::demo 你可以使用`disabled`属性来定义按钮是否可用，它接受一个`Boolean`值。

```
<div>
  <stc-button disabled>默认按钮</stc-button>
  <stc-button type="primary" disabled>主要按钮</stc-button>
  <stc-button type="success" disabled>成功按钮</stc-button>
  <stc-button type="info" disabled>信息按钮</stc-button>
  <stc-button type="warning" disabled>警告按钮</stc-button>
  <stc-button type="danger" disabled>危险按钮</stc-button>
</div>

<div>
  <stc-button plain disabled>朴素按钮</stc-button>
  <stc-button type="primary" plain disabled>主要按钮</stc-button>
  <stc-button type="success" plain disabled>成功按钮</stc-button>
  <stc-button type="info" plain disabled>信息按钮</stc-button>
  <stc-button type="warning" plain disabled>警告按钮</stc-button>
  <stc-button type="danger" plain disabled>危险按钮</stc-button>
</div>
```

:::

### 图标按钮

带图标的按钮可增强辨识度（有文字）或节省空间（无文字）。

:::demo 设置`icon`属性即可，icon 的列表可以参考 svgIcon 组件，也可以设置在文字右边的 icon ，可以使用自定义图标。

```
<stc-button type="primary" icon="edit-fill"></stc-button>
<stc-button type="primary" icon="link"></stc-button>
<stc-button type="primary" icon="delete"></stc-button>
<stc-button type="primary" icon="search">搜索</stc-button>
<stc-button type="primary">上传
    <stc-svg-icon name="cloud-upload" width="14" height="14" />
</stc-button>
```

:::

### 不同尺寸

Button 组件提供除了默认值以外的三种尺寸，可以在不同场景下选择合适的按钮尺寸。

:::demo 额外的尺寸：`medium`、`small`、`mini`，通过设置`size`属性来配置它们。

```
<div>
  <stc-button>默认按钮</stc-button>
  <stc-button size="medium">中等按钮</stc-button>
  <stc-button size="small">小型按钮</stc-button>
  <stc-button size="mini">超小按钮</stc-button>
</div>
<div>
  <stc-button round>默认按钮</stc-button>
  <stc-button size="medium" round>中等按钮</stc-button>
  <stc-button size="small" round>小型按钮</stc-button>
  <stc-button size="mini" round>超小按钮</stc-button>
</div>
```

:::

### Attributes

| 参数        | 说明           | 类型    | 可选值                                            | 默认值 |
| ----------- | -------------- | ------- | ------------------------------------------------- | ------ |
| size        | 尺寸           | string  | medium / small / mini                             | —      |
| type        | 类型           | string  | primary / success / warning / danger / info /text | —      |
| plain       | 是否朴素按钮   | boolean | —                                                 | false  |
| round       | 是否圆角按钮   | boolean | —                                                 | false  |
| circle      | 是否圆形按钮   | boolean | —                                                 | false  |
| disabled    | 是否禁用状态   | boolean | —                                                 | false  |
| icon        | svg图标名字    | string  | —                                                 | —      |
| native-type | 原生 type 属性 | string  | button / submit / reset                           | button |

注意：关于icon，如果直接传入name，颜色为默认不支持修改，如果希望自定义颜色大小等，建议使用`stc-svg-icon`