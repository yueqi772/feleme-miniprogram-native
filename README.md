# A里味 - 微信小程序原生版

> 职场情绪管理与自我认知工具 · 微信小程序

## 功能

- 📋 职场环境识别测试（PUA行为检测）
- 🌳 情绪树洞（匿名倾诉 + AI对话）
- 🎭 情景练习室（AI角色扮演）
- 💬 互助社区
- 📊 个性化报告与分析

## 技术栈

- 原生微信小程序（JavaScript）
- 腾讯云开发（CloudBase）
- 云函数：login / initUser / tcb

## 快速开始

1. 克隆项目
2. 导入微信开发者工具
3. 填写 cloudbase 环境 ID
4. 上传 cloudfunctions 下的三个云函数

## 云函数部署

在微信开发者工具中，右键以下目录 → 上传并部署：

- `cloudfunctions/login`
- `cloudfunctions/initUser`
- `cloudfunctions/tcb`

## 数据库集合

自动创建（写入时）：feleme_testHistory、feleme_diaries、feleme_posts 等

