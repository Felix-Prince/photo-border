# 自动添加照片水印边框&阴影浮雕效果需求文档

-   根据照片获取相机相关参数信息，在底部自动增加白条，效果类似这个
-   阴影边框实现浮雕层次感，类似下图

## 2024-07-08 V1 版本 demo

完成 demo 实现效果如下
![效果图](./div-image.png)

## 2024-07-17 V2 版本规划

针对 V1 中发现的问题，在 V2 中需要进一步解决

1. 上传的图片需要转位 base64 后才能通过 html2canvas 库进行转换
2. 目前只能支持一个图片的处理，效率低下
3. 思路：把需要的图片文件在一个文件夹中存放，通过服务端直接处理图片
4. 通过图片获取的快门数据是小数格式的，但是常用的快门参数都是 1/60 这样的分数形式
5. 因为根据小数反推分数会因小数的精度丢失而无法完美反推，所以考虑通过映射来实现分数显示
6.


## V2 版本已经完成
查看 branck V2 即可


## V3 版本规划中。。。。
To Be Continue
