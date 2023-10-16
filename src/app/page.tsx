import BouncyString from "./components/BouncyString";
import BouncyTest from "./components/BouncyTest";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.body}>
        <BouncyString lineDelta={50} defaultTime={Math.PI / 2} />
        {/* <BouncyTest /> */}
        <div className={styles.description}>
          <p>Smart Development</p>
          <p>
            Combining unique design and rich technology, we build digital
            products exactly as they were designed, without shortcuts or
            simplifications.
          </p>
          B
        </div>
        <div className={styles.tagsContainer}>
          <p>Areas</p>
          <div className={styles.tags}>
            <p>E-commerce</p>
            <p>Finance</p>
            <p>Education</p>
            <p>Social</p>
            <p>Entertainment</p>
            <p>Medicine</p>
          </div>
        </div>
      </div>
    </main>
  );
}
