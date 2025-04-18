import styles from './Loader.module.css';
import classNames from 'classnames';

type LoaderProps = {
  className?: string;
  text?: string;
};

export const Loader = ({ className, text }: LoaderProps) => {
  return (
    <div className={classNames(styles.loader, className)}>
      <div className={styles.iconWrapper}>
        <svg
          className={styles.icon}
          width="40"
          height="40"
          viewBox="0 0 24 47"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.8402 0.631042V2.20832H3.51265V0.631042H0.360596V3.7831H1.93788V17.9684H5.08742V6.93238H19.2656V17.9684H22.4152V3.7831H24V0.631042H20.8402Z"
            fill="black"
          />
          <path
            d="M19.2655 32.1541V40.0306H17.6907V38.4558H16.1135V40.0306H14.5387V38.4558H12.9639V40.0306H11.3891V38.4558H9.81437V40.0306H8.23709V38.4558H6.66232V40.0306H5.08754V28.9946H1.938V43.1799H0.360718V46.3319H3.51277V44.7546H20.8403V46.3319H23.9999V43.1799H22.4151V28.9946H19.2656L19.2655 32.1541Z"
            fill="black"
          />
          <path d="M16.113 28.9946H19.2651V25.845H16.113V28.9946Z" fill="black" />
          <path d="M16.113 17.9688V21.1184H19.2651V17.9688H16.113Z" fill="black" />
          <path d="M16.113 14.8163H17.6878V16.3911H16.113V14.8163Z" fill="black" />
          <path d="M14.5383 36.8787H16.1131V38.4535H14.5383V36.8787Z" fill="black" />
          <path d="M14.5383 16.3942H16.1131V17.969H14.5383V16.3942Z" fill="black" />
          <path d="M14.5383 13.2417H16.1131V14.8165H14.5383V13.2417Z" fill="black" />
          <path d="M12.9637 35.3041H14.5385V36.8788H12.9637V35.3041Z" fill="black" />
          <path d="M12.9637 21.1181V25.845H16.1133V21.1181H12.9637Z" fill="black" />
          <path d="M12.9637 14.8163H14.5385V16.3911H12.9637V14.8163Z" fill="black" />
          <path d="M11.389 36.8787H12.9638V38.4535H11.389V36.8787Z" fill="black" />
          <path d="M11.389 33.7294H12.9638V35.3042H11.389V33.7294Z" fill="black" />
          <path d="M11.389 30.5795H12.9638V32.1543H11.389V30.5795Z" fill="black" />
          <path d="M11.389 27.4199H12.9638V28.9947H11.389V27.4199Z" fill="black" />
          <path d="M11.389 19.5435H12.9638V21.1183H11.389V19.5435Z" fill="black" />
          <path d="M11.389 16.3942H12.9638V17.969H11.389V16.3942Z" fill="black" />
          <path d="M11.389 13.2417H12.9638V14.8165H11.389V13.2417Z" fill="black" />
          <path d="M9.81384 35.3041H11.3886V36.8788H9.81384V35.3041Z" fill="black" />
          <path d="M11.3891 25.8453V21.1184H8.23706V25.8453H11.3891Z" fill="black" />
          <path d="M9.81384 14.8163H11.3886V16.3911H9.81384V14.8163Z" fill="black" />
          <path d="M8.23657 36.8787H9.81135V38.4535H8.23657V36.8787Z" fill="black" />
          <path d="M8.23657 16.3942H9.81135V17.969H8.23657V16.3942Z" fill="black" />
          <path d="M8.23657 13.2417H9.81135V14.8165H8.23657V13.2417Z" fill="black" />
          <path d="M8.23658 28.9946V25.845H5.08704V28.9946H8.23658Z" fill="black" />
          <path d="M8.23658 17.9688H5.08704V21.1184H8.23658V17.9688Z" fill="black" />
          <path d="M6.66199 14.8163H8.23676V16.3911H6.66199V14.8163Z" fill="black" />
        </svg>
      </div>
      {text && <span className={styles.text}>{text}</span>}
    </div>
  );
};
