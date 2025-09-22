import { useTheme } from '../contexts/ThemeContext';

interface Task {
  id: string;
  countdown: string;
  deadline?: string;
  title: string;
  description: string;
  folderColor: string;
  type: '一次性' | '循环';
  duration?: string;
  priority?: 'high' | 'medium' | 'low';
  category?: string;
}

interface FolderType {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: React.ReactNode;
  category: string;
}

interface FolderSectionProps {
  folders: FolderType[];
  tasks: Task[];
  onFolderClick: (folder: FolderType) => void;
}

export function FolderSection({ folders, tasks, onFolderClick }: FolderSectionProps) {
  const { theme } = useTheme();

  const getTaskCount = (folderCategory: string) => {
    return tasks.filter(task => task.category === folderCategory).length;
  };

  return (
    <div className="space-y-4">
      <h2 style={{ color: theme.colors.foreground }}>
        文件夹
      </h2>
      
      <div className="grid grid-cols-2 gap-3">
        {folders.map((folder) => {
          const taskCount = getTaskCount(folder.category);
          
          return (
            <button
              key={folder.id}
              onClick={() => onFolderClick(folder)}
              className={`p-4 rounded-2xl transition-all duration-300 border text-left ${theme.styles.cardStyle}`}
              style={{
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.cardBorder,
              }}
            >
              <div className="flex flex-col items-start gap-3">
                {/* Folder Icon */}
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: folder.color }}
                >
                  {folder.icon}
                </div>
                
                {/* Folder Info */}
                <div className="w-full">
                  <h3 className="mb-1" style={{ color: theme.colors.foreground }}>
                    {folder.name}
                  </h3>
                  <p 
                    className="text-sm mb-2 line-clamp-2" 
                    style={{ color: theme.colors.mutedForeground }}
                  >
                    {folder.description}
                  </p>
                  <div 
                    className="text-xs"
                    style={{ color: theme.colors.mutedForeground }}
                  >
                    {taskCount} 个任务
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}