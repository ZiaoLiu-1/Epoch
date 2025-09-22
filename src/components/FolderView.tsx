import { useState } from 'react';
import { ArrowLeft, Edit3, Check, X, Folder, Clock, CheckCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { TaskCard } from './TaskCard';

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

interface Folder {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: React.ReactNode;
  category: string;
}

interface FolderViewProps {
  folder: Folder;
  tasks: Task[];
  onBack: () => void;
  onTaskClick: (task: Task) => void;
  onUpdateFolder: (folder: Folder) => void;
}

export function FolderView({ folder, tasks, onBack, onTaskClick, onUpdateFolder }: FolderViewProps) {
  const { theme } = useTheme();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editName, setEditName] = useState(folder.name);
  const [editDescription, setEditDescription] = useState(folder.description);

  const handleSaveName = () => {
    onUpdateFolder({ ...folder, name: editName });
    setIsEditingName(false);
  };

  const handleSaveDescription = () => {
    onUpdateFolder({ ...folder, description: editDescription });
    setIsEditingDescription(false);
  };

  const handleCancelName = () => {
    setEditName(folder.name);
    setIsEditingName(false);
  };

  const handleCancelDescription = () => {
    setEditDescription(folder.description);
    setIsEditingDescription(false);
  };

  const folderTasks = tasks.filter(task => task.category === folder.category);
  const oneTimeTasks = folderTasks.filter(task => task.type === '一次性');
  const recurringTasks = folderTasks.filter(task => task.type === '循环');

  return (
    <div 
      className="min-h-screen pb-24"
      style={{ background: theme.styles.backgroundImage }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-6 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 transition-colors"
          style={{ color: theme.colors.mutedForeground }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回</span>
        </button>
        
        <div className="flex-1" />
      </div>

      <div className="px-4 space-y-6">
        {/* Folder Header */}
        <div 
          className={`p-6 rounded-3xl border ${theme.styles.cardStyle}`}
          style={{
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.cardBorder,
          }}
        >
          {/* Folder Icon and Title */}
          <div className="flex items-start gap-4 mb-4">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl"
              style={{ backgroundColor: folder.color }}
            >
              {folder.icon}
            </div>
            
            <div className="flex-1">
              {/* Folder Name */}
              {isEditingName ? (
                <div className="flex items-center gap-2 mb-2">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 bg-transparent border border-gray-300 rounded-lg px-3 py-2 text-xl"
                    style={{ 
                      color: theme.colors.foreground,
                      borderColor: theme.colors.cardBorder 
                    }}
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-2 rounded-lg transition-colors"
                    style={{ 
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.primaryForeground 
                    }}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancelName}
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: theme.colors.mutedForeground }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl" style={{ color: theme.colors.foreground }}>
                    {folder.name}
                  </h1>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="p-1 rounded-lg transition-colors opacity-60 hover:opacity-100"
                    style={{ color: theme.colors.mutedForeground }}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Task Count */}
              <div className="flex items-center gap-4 text-sm">
                <span style={{ color: theme.colors.mutedForeground }}>
                  {folderTasks.length} 个任务
                </span>
                {oneTimeTasks.length > 0 && (
                  <span style={{ color: theme.colors.mutedForeground }}>
                    <Clock className="w-4 h-4 inline mr-1" />
                    {oneTimeTasks.length} 个一次性
                  </span>
                )}
                {recurringTasks.length > 0 && (
                  <span style={{ color: theme.colors.mutedForeground }}>
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    {recurringTasks.length} 个循环
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Folder Description */}
          <div>
            {isEditingDescription ? (
              <div className="space-y-3">
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-transparent border border-gray-300 rounded-lg px-3 py-2 min-h-[80px] resize-none"
                  style={{ 
                    color: theme.colors.foreground,
                    borderColor: theme.colors.cardBorder 
                  }}
                  placeholder="添加文件夹描述..."
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveDescription}
                    className="px-4 py-2 rounded-lg transition-colors"
                    style={{ 
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.primaryForeground 
                    }}
                  >
                    保存
                  </button>
                  <button
                    onClick={handleCancelDescription}
                    className="px-4 py-2 rounded-lg transition-colors"
                    style={{ 
                      backgroundColor: theme.colors.secondary,
                      color: theme.colors.foreground 
                    }}
                  >
                    取消
                  </button>
                </div>
              </div>
            ) : (
              <div 
                className="group cursor-pointer"
                onClick={() => setIsEditingDescription(true)}
              >
                {folder.description ? (
                  <p 
                    className="leading-relaxed"
                    style={{ color: theme.colors.mutedForeground }}
                  >
                    {folder.description}
                  </p>
                ) : (
                  <p 
                    className="italic"
                    style={{ color: theme.colors.mutedForeground }}
                  >
                    点击添加文件夹描述...
                  </p>
                )}
                <Edit3 className="w-4 h-4 mt-2 opacity-0 group-hover:opacity-60 transition-opacity" 
                       style={{ color: theme.colors.mutedForeground }} />
              </div>
            )}
          </div>
        </div>

        {/* Tasks List */}
        {folderTasks.length === 0 ? (
          <div 
            className={`p-8 rounded-2xl border text-center ${theme.styles.cardStyle}`}
            style={{
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.cardBorder,
            }}
          >
            <Folder className="w-12 h-12 mx-auto mb-4 opacity-40" 
                    style={{ color: theme.colors.mutedForeground }} />
            <p style={{ color: theme.colors.mutedForeground }}>
              这个文件夹还没有任务
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* One-time Tasks */}
            {oneTimeTasks.length > 0 && (
              <div className="space-y-4">
                <h3 style={{ color: theme.colors.foreground }}>
                  一次性任务 ({oneTimeTasks.length})
                </h3>
                <div className="space-y-3">
                  {oneTimeTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onClick={() => onTaskClick(task)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Recurring Tasks */}
            {recurringTasks.length > 0 && (
              <div className="space-y-4">
                <h3 style={{ color: theme.colors.foreground }}>
                  循环任务 ({recurringTasks.length})
                </h3>
                <div className="space-y-3">
                  {recurringTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onClick={() => onTaskClick(task)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}