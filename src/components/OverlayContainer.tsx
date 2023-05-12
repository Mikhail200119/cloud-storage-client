import { ReactNode } from "react";
import styles from "./OverlayContainer.module.css";

interface Props {
  children: ReactNode;
}

const OverlayContainer = ({ children }: Props) => {
  return <div className={styles.overlayContainer}>{children}</div>;
};

export default OverlayContainer;
