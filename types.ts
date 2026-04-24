export interface ActionResult {
  score: number;
  total: number;
  mistakes: { question: string; correctAnswer?: string }[];
}

export interface Option {
  id: number | string;
  text: string;
  correct: boolean;
}

export interface MCQuestion {
  id: number | string;
  question: string;
  options: Option[];
}

export interface TFQuestion {
  id: number | string;
  question: string;
  isTrue: boolean;
}

export interface ClozeBlock {
  id: number | string;
  text: string;
}

export interface MemoryCard {
  id: number | string;
  content: string;
  pairId: number | string;
}

export interface Interaction {
  id: number | string;
  time: number | string;
  type: string;
  data: ActivityData;
  useHotspot?: boolean;
  x?: number;
  y?: number;
}

export interface Hotspot {
  id: number | string;
  top: number;
  left: number;
  header: string;
  content: string;
}

export interface DragZone {
  id: number | string;
  top: number;
  left: number;
  width?: number;
  height?: number;
  label?: string;
}

export interface DragItem {
  id: number | string;
  type: 'text' | 'image';
  content: string;
  correctZoneId?: number | string | null;
  x?: number | null;
  y?: number | null;
}

export interface DragDropTask {
  id: number | string;
  backgroundUrl: string;
  altText: string;
  zones: DragZone[];
  items: DragItem[];
}

export interface Scene {
  id: number | string;
  imageUrl?: string;
  videoUrl?: string;
  altText?: string;
  hotspots?: Hotspot[];
  interactions?: Interaction[];
}

export interface TimelineEvent {
  id: number | string;
  date: string;
  title: string;
  body: string;
  imageUrl?: string;
}

export interface MixedItem {
  type: string;
  data: ActivityData;
}

export interface ActivityData {
  questions?: (MCQuestion | TFQuestion | any)[];
  blocks?: ClozeBlock[];
  scenes?: Scene[];
  events?: TimelineEvent[];
  tasks?: DragDropTask[];
  items?: MixedItem[];
  cards?: MemoryCard[];
}

export interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  data: ActivityData;
  createdAt: string;
}

export interface PlayerProps {
  data: ActivityData;
  onSuccess?: (result: ActionResult | {}) => void;
  compact?: boolean;
}
