# 基于高德数据 tsx-taro 版h5的省市区选择器

- 因为taro picker组件 mode='region' 对于h5实际不兼容，因此通过 multiSelector 进行封装
- 数据来源高德api
- 数据类似region.ts 该组件使用接口请求获取数据，可自行改为region中的数据
- 如果多端开发，为了省市区数据适配，亦可小程序使用该组件

## 修改数据重点位置

```js
// 改为不请求接口 直接取 const regionAllTemp = region?.districts?.[0]?.districts;
const res = await getRegion();
if (res) {
    const regionAllTemp = res?.data?.districts?.[0]?.districts;
    ...
}
```

## 演示

![演示](https://jinpika-1308276765.cos.ap-shanghai.myqcloud.com/images/2BA40E76-C012-47f9-BEDA-1DCDCD8A69A6.png)

## demo

```js
// 使用
const onReigonChange = (e, obj: TRegionObj) => {
  console.log(e, obj);
};

<RegionPicker
  onReigonChange={onReigonChange}
  initialValues={[1, 2, 0]}
/>
```
