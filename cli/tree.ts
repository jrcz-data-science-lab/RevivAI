type TreeNode = { [key: string]: TreeNode | null };

function buildTree(paths: string[]): TreeNode {
  const root: TreeNode = {};
  paths.forEach((path) => {
    const parts = path.split('/').filter(Boolean); // Remove empty parts, e.g., from "./"
    let current = root;
    parts.forEach((part, index) => {
      if (!current[part]) {
        current[part] = index === parts.length - 1 ? null : {};
      }
      if (current[part] !== null) {
        current = current[part] as TreeNode;
      }
    });
  });
  return root;
}

function printTree(node: TreeNode, prefix: string = ''): void {
  const entries = Object.entries(node);
  entries.forEach(([key, childNode], index) => {
    const isLast = index === entries.length - 1;
    console.log(`${prefix}${isLast ? '└── ' : '├── '}${key}`);
    if (childNode) {
      printTree(childNode, `${prefix}${isLast ? '    ' : '│   '}`);
    }
  });
}

// Example usage
const paths = [
  './ui',
  './ui/dist',
  './ui/dist/assets',
  './ui/node_modules',
  './ui/node_modules/@types',
  './ui/node_modules/.bin',
  './ui/node_modules/@eslint',
  './ui/node_modules/@tailwindcss',
  './ui/node_modules/@electric-sql',
  './ui/node_modules/.deno',
];

const tree = buildTree(paths);
printTree(tree);