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
function getNodeDFSByStack(tree) {
    let res = [];
    if (!tree) return res;
    let stack = [tree];
    while (stack.length) {
      let node = stack.pop();
      if (node) {
        res.push(node.value);
        stack.push(node.right, node.left);
      }
    }
    return res;
  }
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
 console.log(getNodeDFSByStack(tree)); 