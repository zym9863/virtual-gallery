# WebXR 虚拟画廊

中文 | [English](README_EN.md)

这是一个基于Three.js和WebXR技术构建的虚拟艺术画廊，允许用户在虚拟现实环境中浏览艺术作品。

## 功能特点

- 3D虚拟画廊环境，包含墙壁、地板、天花板和照明
- 支持WebXR，可在VR头显中体验
- 艺术品展示，包括画框和信息面板
- 交互式控制，支持VR控制器和普通鼠标/键盘操作
- 响应式设计，适应不同屏幕尺寸

## 技术栈

- Three.js - 3D图形库
- WebXR - Web虚拟现实和增强现实API
- Vite - 前端构建工具

## 安装与运行

### 前提条件

- Node.js (v14.0.0或更高版本)
- 支持WebXR的浏览器（如Chrome、Firefox、Edge最新版本）
- VR头显（可选，用于VR体验）

### 安装步骤

1. 克隆或下载此仓库
2. 安装依赖
   ```bash
   npm install
   ```

3. 启动开发服务器
   ```bash
   npm run dev
   ```

4. 在浏览器中访问显示的URL（通常是 http://localhost:5173）

### 使用说明

#### 普通模式
- 使用鼠标左键点击并拖动来旋转视角
- 使用鼠标滚轮来缩放
- 使用W、A、S、D键来移动
- 按ESC键退出VR模式

#### VR模式
- 点击右下角的VR按钮进入VR模式
- 使用VR控制器的触摸板/摇杆进行移动
- 使用控制器按钮进行交互

## 项目结构

```
.
├── js/                    # JavaScript源代码
│   ├── artwork.js         # 艺术品相关逻辑
│   ├── controls.js        # 控制器实现
│   ├── gallery.js         # 画廊场景管理
│   └── main.js            # 主程序入口
├── index.html            # 主页面
├── package.json          # 项目配置
└── vite.config.js        # Vite配置
```

## 贡献指南

1. Fork本仓库
2. 创建您的特性分支 (git checkout -b feature/AmazingFeature)
3. 提交您的更改 (git commit -m 'Add some AmazingFeature')
4. 推送到分支 (git push origin feature/AmazingFeature)
5. 打开一个Pull Request

## 许可证

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情