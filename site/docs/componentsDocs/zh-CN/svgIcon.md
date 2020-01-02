# SvgIcon 图标

提供了一套常用的图标集合。

## 使用方法

直接通过设置`name`属性为 `svgName` 来使用即可。例如：

:::demo 图标name为`refresh`
```html
<stc-svg-icon name="refresh" fill="#454D58" width="12" height="12" />
```
:::

### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|----------|-------------- |---------- |--------------------------------  |-------- |
| name     | 图标名称       | string | — | — |
| fill | use填充颜色 | string | — | currentColor |
| width | 宽度 | string | — | 14 |
| height | 高度 | string | — | 14 |

### 图标集合

<ul class="svg-list">
  <li v-for="name in $svg" :key="name">
    <span>
      <stc-svg-icon :name="name" fill="#454D58" width="16" height="16" />
    </span>
    <span class="svg-name">{{name}}</span>
  </li>
</ul>
