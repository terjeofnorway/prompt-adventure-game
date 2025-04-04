import { StorySegment as StorySegmentType } from '@shared/types/Story';

import styles from './StorySegment.module.css';

type StorySegmentProps = {
  storySegment: StorySegmentType;
};

export const StorySegment = ({ storySegment }: StorySegmentProps) => {
  const content =
    typeof storySegment.content === 'string' ? storySegment.content : JSON.stringify(storySegment.content);

  const { meta: { imageId, characterDescription } = {}, role } = storySegment;
  const styleVariaion = role === 'user' ? styles.user : styles.agent;

  return (
    <div id={storySegment.id || undefined} className={`${styles.storySegment} ${styleVariaion}`}>
      {content}
    </div>
  );
};
