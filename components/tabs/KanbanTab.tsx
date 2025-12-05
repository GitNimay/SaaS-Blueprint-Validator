
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { ProjectData, Ticket } from '../../types';
import { Plus, X, MoreHorizontal, Save } from 'lucide-react';
import { ScrollReveal } from '../ui/ScrollReveal';

interface KanbanTabProps {
  data: ProjectData;
  onUpdate?: (data: ProjectData) => void;
}

const KanbanTab: React.FC<KanbanTabProps> = ({ data, onUpdate }) => {
  const [columns, setColumns] = useState<Record<string, { id: string; title: string; items: Ticket[] }>>({
    backlog: { id: 'backlog', title: 'Backlog', items: data.kanban.backlog },
    todo: { id: 'todo', title: 'To Do', items: data.kanban.todo || [] },
    progress: { id: 'progress', title: 'In Progress', items: data.kanban.inProgress },
    review: { id: 'review', title: 'Review', items: data.kanban.review || [] },
    done: { id: 'done', title: 'Done', items: data.kanban.done },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [newTicketTag, setNewTicketTag] = useState<Ticket['tag']>('Frontend');
  const [isSaving, setIsSaving] = useState(false);

  // Sync internal state if props change (unlikely in this flow, but good practice)
  useEffect(() => {
    setColumns({
        backlog: { id: 'backlog', title: 'Backlog', items: data.kanban.backlog },
        todo: { id: 'todo', title: 'To Do', items: data.kanban.todo || [] },
        progress: { id: 'progress', title: 'In Progress', items: data.kanban.inProgress },
        review: { id: 'review', title: 'Review', items: data.kanban.review || [] },
        done: { id: 'done', title: 'Done', items: data.kanban.done },
    });
  }, [data.kanban]);

  const saveChanges = (newColumns: any) => {
    if (!onUpdate) return;
    
    setIsSaving(true);
    // Construct new project data object
    const updatedData: ProjectData = {
        ...data,
        kanban: {
            backlog: newColumns.backlog.items,
            todo: newColumns.todo.items,
            inProgress: newColumns.progress.items,
            review: newColumns.review.items,
            done: newColumns.done.items
        }
    };
    
    onUpdate(updatedData);
    
    // Fake visual delay for saving indicator
    setTimeout(() => setIsSaving(false), 800);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;

    let newColumns;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId as keyof typeof columns];
      const destColumn = columns[destination.droppableId as keyof typeof columns];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      
      newColumns = {
        ...columns,
        [source.droppableId]: { ...sourceColumn, items: sourceItems },
        [destination.droppableId]: { ...destColumn, items: destItems },
      };
    } else {
      const column = columns[source.droppableId as keyof typeof columns];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      
      newColumns = {
        ...columns,
        [source.droppableId]: { ...column, items: copiedItems },
      };
    }

    setColumns(newColumns);
    saveChanges(newColumns);
  };

  const handleAddTicket = () => {
    if (!newTicketTitle.trim()) return;
    const newTicket: Ticket = {
      id: `new-${Date.now()}`,
      title: newTicketTitle,
      tag: newTicketTag,
    };
    
    const newColumns = {
      ...columns,
      backlog: { ...columns.backlog, items: [newTicket, ...columns.backlog.items] },
    };

    setColumns(newColumns);
    setNewTicketTitle('');
    setIsModalOpen(false);
    saveChanges(newColumns);
  };

  const getTagStyle = (tag: string) => {
    // Minimal aesthetic colors
    switch (tag) {
      case 'Backend': return 'text-red-400 bg-red-950/30 border-red-900/50';
      case 'Frontend': return 'text-blue-400 bg-blue-950/30 border-blue-900/50';
      case 'Design': return 'text-purple-400 bg-purple-950/30 border-purple-900/50';
      case 'DevOps': return 'text-orange-400 bg-orange-950/30 border-orange-900/50';
      default: return 'text-neutral-400 bg-neutral-900 border-neutral-800';
    }
  };

  return (
    <div className="h-full relative pb-10">
      <ScrollReveal>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div>
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    Execution Roadmap
                    {isSaving && <span className="text-[10px] text-neutral-500 font-mono flex items-center gap-1 animate-pulse"><Save className="w-3 h-3 animate-spin"/> Saving...</span>}
                </h2>
                <p className="text-sm text-neutral-500">Drag and drop tickets to manage progress.</p>
            </div>
            <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 text-xs bg-white text-black font-semibold px-4 py-2 rounded hover:bg-neutral-200 transition-all duration-200 active:scale-95 shadow-sm w-full sm:w-auto"
            >
            <Plus className="w-3 h-3" /> New Ticket
            </button>
        </div>
      </ScrollReveal>

      <DragDropContext onDragEnd={onDragEnd}>
        {/* Force flex-row and scroll on mobile for better Kanban experience */}
        <div className="flex flex-row gap-4 overflow-x-auto pb-4 items-start snap-x h-[calc(100vh-250px)] sm:h-auto no-scrollbar">
        {Object.entries(columns).map(([columnId, column]: [string, { id: string; title: string; items: Ticket[] }]) => (
            <div key={columnId} className="flex-none w-[85vw] sm:w-[300px] sm:flex-1 sm:min-w-[280px] sm:max-w-[320px] flex flex-col snap-center">
            <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{column.title}</span>
                <span className="text-[10px] text-neutral-600 font-mono bg-neutral-900/50 px-2 py-0.5 rounded-full border border-neutral-800">{column.items.length}</span>
            </div>
            
            <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex-1 space-y-2 rounded-lg min-h-[150px] transition-colors duration-200 p-1 ${
                        snapshot.isDraggingOver ? 'bg-neutral-900/30 ring-1 ring-neutral-800' : ''
                    }`}
                >
                    {column.items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-600 hover:bg-neutral-800 group transition-all duration-200 ease-out ${
                                snapshot.isDragging ? 'shadow-2xl ring-1 ring-white/20 rotate-1 bg-black z-50 scale-105' : 'shadow-sm hover:shadow-md hover:-translate-y-0.5'
                            }`}
                            style={provided.draggableProps.style}
                        >
                            <div className="flex justify-between items-center gap-2">
                                <p className="text-xs text-neutral-300 font-medium truncate flex-1 group-hover:text-white transition-colors">{item.title}</p>
                                {/* Only visible on hover or dragging */}
                                <MoreHorizontal className={`w-3 h-3 text-neutral-600 transition-opacity ${snapshot.isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                            </div>

                            {/* Expanded Details - revealed on hover */}
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${snapshot.isDragging ? 'max-h-10 mt-2 opacity-100' : 'max-h-10 mt-2 opacity-100 sm:max-h-0 sm:opacity-0 sm:group-hover:max-h-10 sm:group-hover:mt-2 sm:group-hover:opacity-100'}`}>
                                <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded border ${getTagStyle(item.tag)}`}>
                                    {item.tag}
                                </span>
                            </div>
                        </div>
                        )}
                    </Draggable>
                    ))}
                    {provided.placeholder}
                </div>
                )}
            </Droppable>
            </div>
        ))}
        </div>
      </DragDropContext>

      {/* Minimal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-black border-t sm:border border-neutral-800 rounded-t-xl sm:rounded-lg shadow-2xl w-full max-w-sm overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-neutral-900">
              <h3 className="text-sm font-semibold text-white">Create Ticket</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-[10px] font-medium text-neutral-500 uppercase mb-1.5">Title</label>
                <input 
                  type="text" 
                  value={newTicketTitle}
                  onChange={(e) => setNewTicketTitle(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all"
                  placeholder="Feature name..."
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTicket()}
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-neutral-500 uppercase mb-1.5">Tag</label>
                <select 
                  value={newTicketTag}
                  onChange={(e) => setNewTicketTag(e.target.value as any)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 appearance-none transition-all"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Design">Design</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Database">Database</option>
                </select>
              </div>
            </div>
            <div className="p-4 border-t border-neutral-900 flex justify-end gap-2">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddTicket}
                disabled={!newTicketTitle.trim()}
                className="px-3 py-1.5 text-xs bg-white text-black font-semibold rounded hover:bg-neutral-200 disabled:opacity-50 transition-all active:scale-95"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanTab;
