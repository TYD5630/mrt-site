---
title: "micrograd"
description: "micrograd"
sidebar:
  order: 50
  label: "micrograd"
tags: ["neural-network", "backpropagation", "autograd", "python", "education"]
---

# micrograd

Andrej Karpathy 的微型自动求导引擎。~100 行 Python，实现标量级别的反向传播。

## 核心价值
- 教学目的：**理解反向传播的本质**
- 不依赖任何深度学习框架
- 完整实现 `Value` 类，支持 +、*、tanh、exp、pow 等运算的自动求导
- PyTorch API 风格（`.backward()`, `.grad`）

## 代码结构
```python
class Value:
    def __init__(self, data, _children=(), _op=''):
        self.data = data        # 标量值
        self.grad = 0           # 梯度
        self._backward = lambda: None
    
    def __add__(self, other):   # 加法 + 反向传播链
    def __mul__(self, other):   # 乘法 + 反向传播链
    def tanh(self):             # tanh 激活 + 反向传播链
    def backward(self):         # 拓扑排序反向传播
```

## 相关页面
- [nn-zero-to-hero](/docs/nn-zero-to-hero)
- [nanoGPT](/docs/nanogpt)
- [backpropagation](/docs/backpropagation)

