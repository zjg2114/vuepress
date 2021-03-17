# 二叉树的遍历

## BFS

```js
const tree = {
  value: 1,
  left: {
    value: 2,
    left: {
      value: 4,
    },
    right: {
      value: 5,
    },
  },
  right: {
    value: 3,
    left: {
      value: 6,
    },
    right: {
      value: 7,
    },
  },
};
```

- 广度遍历 队列实现

```js
function getNodeBFSByQuene(tree) {
  let res = [];
  if (!tree) return res;
  let quene = [tree];
  while (quene.length) {
    let node = quene.shift();
    if (node) {
      res.push(node.value);
      quene.push(node.left, node.right);
    }
  }
  return res;
}
console.log(getNodeBFSByQuene(tree));
 // [ 1, 2, 3 , 4, 5, 6, 7 ]

```

- 广度遍历 递归实现

```js
function getNodeBFSByRecursivel(tree) {
  let res = [];
  let queue=[tree]
  let index = 0;
  function wideTraversal() {
    const curNodes = queue[index]
    index++
    if (curNodes) {
      res.push(curNodes.value)
      curNodes.left && queue.push(curNodes.left)
      curNodes.right && queue.push(curNodes.right)
      wideTraversal()
    }
  }
  wideTraversal()
  return res;
}
const res2 = getNodeBFSByRecursivel(tree)
console.log(res2);
```

- 广度遍历 队列实现 二维数组

```js
function getNodeArrayBFSByQuene(tree) {
  let res = [];
  if (!tree) return res;
  let index = 0;
  let queue = [tree];
  while (queue.length) {
    let size = queue.length;
    res.push([]);
    while (size--) {
      let currentNode = queue.shift();
      res[index].push(currentNode.value);
      if (currentNode.left) {
        queue.push(currentNode.left);
      }
      if (currentNode.right) {
        queue.push(currentNode.right);
      }
    }
    index++;
  }
  return res;
}
console.log(getNodeArrayBFSByQuene(tree));
 // [ [ 1 ], [ 2, 3 ], [ 4, 5, 6, 7 ] ]
```

## DFS

深度哟徐爱你便利分为 先序(根左右) 中序(左根右) 后序(左右根)

- 深度遍历(先序) 栈实现

```js

function getNodeDFSByStack(tree) {
  let res = [];
  if (!tree) return res;
  let stack = [tree];
  while (stack.length) {
    let node = stack.pop();
    if (node) {
      res.push(node.value);
      stack.push(node.left, node.right);
    }
  }
  return res;
}

```

- 深度遍历(先序) 递归实现

```js
function getNodeDFSByRecursivel(tree) {
  let res = [];
  if (!tree) return res;
  function deepTraversal(restTree) {
    res.push(restTree.value);
    restTree.left && deepTraversal(restTree.left)
    restTree.right &&  deepTraversal(restTree.right)
  }
  deepTraversal(tree);
  return res;
}
```

- 深度遍历(中序) 栈实现

```js
// 将当前结点压入栈，然后将左子树当做当前结点，如果当前结点为空，从栈中取出结点，将值保存进数组，然后将右子树当做当前结点，进行循环
function getNodeDFSByStack(tree) {
    let res = [];
    let stack = [];
    while(stack.length || tree) { // 是 || 不是 &&
        if(tree) {
            stack.push(tree);
            tree = tree.left;
        } else {
            tree = stack.pop();
            res.push(tree.value);
            tree = tree.right; // 如果没有右子树 会再次向栈中取一个结点
        }
    }
    return res;
}
```

- 深度遍历(中序) 递归实现

```js
function getNodeDFSByRecursivel(tree) {
    let res = [];
    function deepTraversal(node) {
        if(node) {
          deepTraversal(node.left);
          // 直到该结点无左子树 将该结点存入数组 接下来并开始遍历右子树
          res.push(node.value); 
          deepTraversal(node.right);
      }
    }
    deepTraversal(tree);
    return res
}
```

- 深度遍历(后序) 栈实现

```js
function getNodeDFSByStack(tree){
    function deepTraversal(node) {
        let result = [];
        let stack = [];
        stack.push(node);
        while(stack.length) {
            if(node.left && !node.touched) { 
                node.touched = 'left';
                node = node.left;
                stack.push(node);
                continue;
            }
            if(node.right && node.touched !== 'right') {
                node.touched = 'right';
                node = node.right;
                stack.push(node);
                continue;
            }
            node = stack.pop(); 
            result.push(node.value);
            node = stack.length ? stack[stack.length - 1] : null;
        }
        return result;
    }
    deepTraversal(tree);
}
```

- 深度遍历(后序) 递归实现

```js
function getNodeDFSByRecursivel(tree) {
    let res = [];
    function deepTraversal(node) {
        if(node) {
          deepTraversal(node.left);
          deepTraversal(node.right);
          res.push(node.value); 
      }
    }
    deepTraversal(tree);
    return res
}
```
