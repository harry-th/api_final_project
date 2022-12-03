import { useState } from 'react'
import styles from './Display.module.css'

export default function Display({ subs, topics }) {
    const [orderedSubs, setOrderedSubs] = useState(subs ? subs : [])
    const [order, setOrder] = useState('default')

    const orderSubs = (orderType) => {
        if (orderType === 'subscriber-count') {
            setOrderedSubs(prev => [...prev.sort((a, b) => b.statistics.subscriberCount - a.statistics.subscriberCount)])
        } else if (orderType === 'default') {
            setOrderedSubs([...subs])
        }
    }

    return (
        <div className={styles.outerdisplay}>
            <div className={styles.display}>
                <div className={styles.usercolumn}>
                    <div className={styles.chart}>
                        PIE CHART
                    </div>
                    <div className={styles.user}>
                        user
                    </div>
                </div>
                <div className={styles.insert}>
                    <button onClick={() => orderSubs('default')}>default</button>
                    <button onClick={() => orderSubs('subscriber-count')}>by subs</button>
                </div>
                <div className={styles.subcolumn}>
                    <div className={styles.subcontainer}>
                        {orderedSubs && orderedSubs.map((item) => {
                            return (
                                <div
                                    className={styles[item.topicDetails.mainCategories[0]]} >
                                    <img src={item.snippet.thumbnails.default.url} alt='' />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div >
    )
}