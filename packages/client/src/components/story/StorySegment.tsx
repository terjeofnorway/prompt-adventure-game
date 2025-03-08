import { StorySegment as StorySegmentType } from '@shared/types/Story';

import styles from './StorySegment.module.css';

type StorySegmentProps = {
  storySegment: StorySegmentType;
};

export const StorySegment = ({ storySegment }: StorySegmentProps) => {
  const content =
    typeof storySegment.content === 'string' ? storySegment.content : JSON.stringify(storySegment.content);

  const styleVariaion = storySegment.role === 'user' ? styles.user : styles.agent;

  return <div className={`${styles.storySegment} ${styleVariaion}`}>{content}</div>;
};
