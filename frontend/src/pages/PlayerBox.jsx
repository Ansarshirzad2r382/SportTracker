import styles from '../styles/PlayerBox.module.css'

export const PlayerBox = ({name, icon, card, title, onClick}) => {
    return (
        <button
            className={styles.playerCardContainer}
            type="button"
            onClick={onClick}
            aria-label={`Stats von ${name} anzeigen`}
        >
            <div className={styles.playerIconSection}>
                <img src={icon} alt="Player Icon" className={styles.playerIcon}/>
            </div>
            <div
                className={styles.playerNamecard}
                style={{'--bg-namePlate': `url(${card})`}}
            >
                <div className={styles.textContainer}>
                    <h1 className={styles.playerName}>{name}</h1>
                    {title && <span className={styles.playerTitle}>{title}</span>}
                </div>
            </div>
        </button>
    );
}
