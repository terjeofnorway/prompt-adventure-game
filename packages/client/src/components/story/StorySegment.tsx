import { StorySegment as StorySegmentType } from '@shared/types/Story';

type StorySegmentProps = {
  storySegment: StorySegmentType;
};

export const StorySegment = ({ storySegment }: StorySegmentProps) => {
  const content = JSON.stringify(storySegment.content);

  return <div>{content}</div>;
};
