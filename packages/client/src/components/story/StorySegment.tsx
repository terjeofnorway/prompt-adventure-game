import { StorySegment as StorySegmentType } from '@shared/types/Story';

import styles from './StorySegment.module.css';
import { Image } from './Image';

type StorySegmentProps = {
  storySegment: StorySegmentType;
};

export const StorySegment = ({ storySegment }: StorySegmentProps) => {
  const content =
    typeof storySegment.content === 'string' ? storySegment.content : JSON.stringify(storySegment.content);

  const { meta: { imageId, characterDescription } = {}, role } = storySegment;
  const styleVariaion = role === 'user' ? styles.user : styles.agent;

  return (
    <div className={`${styles.storySegment} ${styleVariaion}`}>
      {imageId && <Image imageId={imageId} imageDescription={characterDescription} />}
      {content}
    </div>
  );
};
