import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Banner } from './banner';
import { GripVertical } from 'lucide-react';

interface SortableItemProps {
  banner: Banner;
}

const SortableBannerItem = ({ banner }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: banner._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center p-4 mb-2 bg-white border rounded shadow-sm group hover:border-violet-400 transition-colors"
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing mr-4 text-gray-400 group-hover:text-violet-500">
        <GripVertical size={20} />
      </div>
      <div className="w-16 h-10 mr-4 overflow-hidden rounded bg-gray-100 flex-shrink-0">
        <img 
          src={banner.bannerImages[0] || '/images/placeholder.jpg'} 
          alt={banner.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-grow">
        <p className="font-medium text-gray-700">{banner.title}</p>
        <p className="text-xs text-gray-400">{banner.slug}</p>
      </div>
      <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">
        Original Pos: {banner.position}
      </div>
    </div>
  );
};

interface Props {
  banners: Banner[];
  onOrderChange: (newBanners: Banner[]) => void;
}

const BannerReorderList = ({ banners, onOrderChange }: Props) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = banners.findIndex((b) => b._id === active.id);
      const newIndex = banners.findIndex((b) => b._id === over.id);
      
      onOrderChange(arrayMove(banners, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="max-w-2xl mx-auto py-4">
        <SortableContext
          items={banners.map(b => b._id)}
          strategy={verticalListSortingStrategy}
        >
          {banners.map((banner) => (
            <SortableBannerItem key={banner._id} banner={banner} />
          ))}
        </SortableContext>
        {banners.length === 0 && (
            <p className="text-center text-gray-500 py-10">No banners to reorder</p>
        )}
      </div>
    </DndContext>
  );
};

export default BannerReorderList;
