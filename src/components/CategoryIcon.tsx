import React from 'react';
import {
  Library,
  FileText,
  Calculator,
  Atom,
  FlaskConical,
  Globe,
  BookOpen,
  Languages,
  GraduationCap,
  Bot,
  Percent,
  Layers,
  Video,
  Users,
  Unlock,
  BookMarked,
  Database,
  Compass,
  Flame,
  Bookmark,
  Sparkles,
  Folder,
  LucideProps
} from 'lucide-react';

interface Props extends LucideProps {
  name: string;
}

export const CategoryIcon: React.FC<Props> = ({ name, ...props }) => {
  switch (name) {
    case 'Library':
      return <Library {...props} />;
    case 'FileText':
      return <FileText {...props} />;
    case 'Calculator':
      return <Calculator {...props} />;
    case 'Atom':
      return <Atom {...props} />;
    case 'FlaskConical':
      return <FlaskConical {...props} />;
    case 'Globe':
      return <Globe {...props} />;
    case 'BookOpen':
      return <BookOpen {...props} />;
    case 'Languages':
      return <Languages {...props} />;
    case 'GraduationCap':
      return <GraduationCap {...props} />;
    case 'Bot':
      return <Bot {...props} />;
    case 'Percent':
      return <Percent {...props} />;
    case 'Layers':
      return <Layers {...props} />;
    case 'Video':
      return <Video {...props} />;
    case 'Users':
      return <Users {...props} />;
    case 'Unlock':
      return <Unlock {...props} />;
    case 'BookMarked':
      return <BookMarked {...props} />;
    case 'Database':
      return <Database {...props} />;
    case 'Compass':
      return <Compass {...props} />;
    case 'Flame':
      return <Flame {...props} />;
    case 'Bookmark':
      return <Bookmark {...props} />;
    case 'Sparkles':
      return <Sparkles {...props} />;
    default:
      return <Folder {...props} />;
  }
};
