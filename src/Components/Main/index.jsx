import styles from './style.module.css'
import Chat from './Chat'

export default function Main(){
    return(
        <div className={styles.divMain}>
            <Chat />
        </div>
    )
}