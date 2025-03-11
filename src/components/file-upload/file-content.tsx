import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, File, Folder } from 'lucide-react';

type FileWithContent = {
  path: string;
  content: string;
  type: string;
};

interface FileContentProps {
  files: FileWithContent[];
}

// File system tree node types
type FileNode = {
  type: 'file';
  name: string;
  path: string;
  content: string;
  fileType: string;
};

type FolderNode = {
  type: 'folder';
  name: string;
  path: string;
  children: Record<string, TreeNode>;
};

type TreeNode = FileNode | FolderNode;

// Convert flat file list to tree structure
function buildFileTree(files: FileWithContent[]): FolderNode {
  const root: FolderNode = {
    type: 'folder',
    name: 'root',
    path: '',
    children: {},
  };

  files.forEach((file) => {
    const pathParts = file.path.split('/');
    let currentNode = root;
    let currentPath = '';

    // Navigate through the path parts to build the tree
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      const isLastPart = i === pathParts.length - 1;
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      if (isLastPart) {
        // This is a file
        currentNode.children[part] = {
          type: 'file',
          name: part,
          path: file.path,
          content: file.content,
          fileType: file.type,
        };
      } else {
        // This is a folder
        if (!currentNode.children[part]) {
          currentNode.children[part] = {
            type: 'folder',
            name: part,
            path: currentPath,
            children: {},
          };
        }
        currentNode = currentNode.children[part] as FolderNode;
      }
    }
  });

  return root;
}

// Simplified File component without content preview
function FileComponent({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  return (
		<div className="overflow-hidden opacity-80">
			<div className="flex items-center w-full p-2 text-left" style={{ paddingLeft: `${(depth + 1) * 0.75}rem` }}>
				<File className="h-4 w-4 mr-2" />
				<span className="font-light truncate">{node.name}</span>
			</div>
		</div>
  );
}

// Folder component that contains other files and folders
function FolderComponent({ node, depth = 0 }: { node: FolderNode; depth?: number }) {
  const [expanded, setExpanded] = useState(true);
  
  // Sort folders first, then files, both alphabetically
  const sortedChildren: TreeNode[] = useMemo(() => {
		return Object.values(node.children).sort((a, b) => {
			if (a.type === b.type) return a.name.localeCompare(b.name);
			return a.type === 'folder' ? -1 : 1;
		});
  }, [node.children]);

  // Root node doesn't need a folder button
  if (node.name === 'root') {
    return sortedChildren.map((childNode) => <TreeNodeComponent key={childNode.path} node={childNode} depth={depth} />);
  }

  return (
		<div>
			<button
				className="flex items-center w-full p-2 px-3 text-left cursor-pointer transition-colors"
				onClick={() => setExpanded(!expanded)}
				style={{ paddingLeft: `${depth * 1}rem` }}
			>
				<Folder className="h-4 w-4 ml-3 mr-2" />
				<span className="font-medium">{node.name}</span>
				<span className="ml-auto">
					<ChevronDown className={cn('h-4 w-4 transition-transform', expanded && '-rotate-90')} />
				</span>
			</button>

			{expanded && (
				<div>
					{sortedChildren.map((childNode) => (
						<TreeNodeComponent key={childNode.path} node={childNode} depth={depth + 1} />
					))}
				</div>
			)}
		</div>
  );
}

// Component that renders either a file or folder based on node type
function TreeNodeComponent({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  if (node.type === 'file') {
    return <FileComponent node={node} depth={depth} />;
  } else {
    return <FolderComponent node={node} depth={depth} />;
  }
}

export function FileContent({ files }: FileContentProps) {
  const fileTree = useMemo(() => buildFileTree(files), [files]);

  return (
    <div className="border rounded-lg divide-y">
      <FolderComponent node={fileTree} />
    </div>
  );
}
