import BouncyString from "./components/BouncyString";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.body}>
        <BouncyString lineDelta={80} step={0.02} />
        <BouncyString lineDelta={80} step={0.01} />
        <BouncyString lineDelta={80} step={0.03} />
      </div>
    </main>
  );
}
