import styles from './BoardKnob.module.css';
import classNames from 'classnames';

interface BoardKnobProps {
  position: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
}

export const BoardKnob = ({ position }: BoardKnobProps) => {
  return (
    <div className={classNames(styles.knob, styles[position])}>
      <svg width="46" height="45" viewBox="0 0 46 45" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="5" width="34" height="34" fill="#AF6540" />
        <rect y="5" width="6" height="34" fill="#462911" />
        <rect x="6" y="5" width="6" height="34" fill="white" />
        <rect x="34" y="5" width="6" height="34" fill="#9A4D34" />
        <rect x="40" y="33" width="6" height="28" transform="rotate(90 40 33)" fill="#9A4D34" />
        <rect x="40" y="5" width="6" height="34" fill="#462911" />
        <rect x="6" y="6" width="6" height="34" transform="rotate(-90 6 6)" fill="#462911" />
        <rect x="6" y="12" width="6" height="34" transform="rotate(-90 6 12)" fill="white" />
        <rect x="6" y="45" width="6" height="34" transform="rotate(-90 6 45)" fill="#462911" />
      </svg>
    </div>
  );
};
