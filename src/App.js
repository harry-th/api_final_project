import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

/* global google */
const topics = [
  { id: "/m/04rlf", topic: "Music", parent: true },
  { id: "/m/02mscn", topic: "Christian music" },
  { id: "/m/0ggq0m", topic: "Classical music" },
  { id: "/m/01lyv", topic: "Country" },
  { id: "/m/02lkt", topic: "Electronic music" },
  { id: "/m/0glt670", topic: "Hip hop music" },
  { id: "/m/05rwpb", topic: "Independent music" },
  { id: "/m/03_d0", topic: "Jazz" },
  { id: "/m/028sqc", topic: "Music of Asia" },
  { id: "/m/0g293", topic: "Music of Latin America" },
  { id: "/m/064t9", topic: "Pop music" },
  { id: "/m/06cqb", topic: "Reggae" },
  { id: "/m/06j6l", topic: "Rhythm and blues" },
  { id: "/m/06by7", topic: "Rock music" },
  { id: "/m/0gywn", topic: "Soul music" },
  { id: "/m/0bzvm2", topic: "Gaming", parent: true },
  { id: "/m/025zzc", topic: "Action game" },
  { id: "/m/02ntfj", topic: "Action-adventure game" },
  { id: "/m/0b1vjn", topic: "Casual game" },
  { id: "/m/02hygl", topic: "Music video game" },
  { id: "/m/04q1x3q", topic: "Puzzle video game" },
  { id: "/m/01sjng", topic: "Racing video game" },
  { id: "/m/0403l3g", topic: "Role-playing video game" },
  { id: "/m/021bp2", topic: "Simulation video game" },
  { id: "/m/022dc6", topic: "Sports game" },
  { id: "/m/03hf_rm", topic: "Strategy video game" },
  { id: "/m/06ntj", topic: "Sports", parent: true },
  { id: "/m/0jm_", topic: "American football" },
  { id: "/m/018jz", topic: "Baseball" },
  { id: "/m/018w8", topic: "Basketball" },
  { id: "/m/01cgz", topic: "Boxing" },
  { id: "/m/09xp_", topic: "Cricket" },
  { id: "/m/02vx4", topic: "Football" },
  { id: "/m/037hz", topic: "Golf" },
  { id: "/m/03tmr", topic: "Ice hockey" },
  { id: "/m/01h7lh", topic: "Mixed martial arts" },
  { id: "/m/0410tth", topic: "Motorsport" },
  { id: "/m/07bs0", topic: "Tennis" },
  { id: "/m/07_53", topic: "Volleyball" },
  { id: "/m/02jjt", topic: "Entertainment", parent: true },
  { id: "/m/09kqc", topic: "Humor" },
  { id: "/m/02vxn", topic: "Movies" },
  { id: "/m/05qjc", topic: "Performing arts" },
  { id: "/m/066wd", topic: "Professional wrestling" },
  { id: "/m/0f2f9", topic: "TV shows" },
  { id: "/m/019_rr", topic: "Lifestyle", parent: true },
  { id: "/m/032tl", topic: "Fashion" },
  { id: "/m/027x7n", topic: "Fitness" },
  { id: "/m/02wbm", topic: "Food" },
  { id: "/m/03glg", topic: "Hobby" },
  { id: "/m/068hy", topic: "Pets" },
  { id: "/m/041xxh", topic: "Physical attractiveness [Beauty]" },
  { id: "/m/07c1v", topic: "Technology" },
  { id: "/m/07bxq", topic: "Tourism" },
  { id: "/m/07yv9", topic: "Vehicles" },
  { id: "/m/098wr", topic: "Society", parent: true },
  { id: "/m/09s1f", topic: "Business" },
  { id: "/m/0kt51", topic: "Health" },
  { id: "/m/01h6rj", topic: "Military" },
  { id: "/m/05qt0", topic: "Politics" },
  { id: "/m/06bvp", topic: "Religion" },
  { id: "/m/01k8wb", topic: "Knowledge" }
];


function App() {

  const [auth, setAuth] = useState(null)
  const [subs, setSubs] = useState(null)
  const [reccomended, setReccomendeded] = useState(null)

  const handleCallbackResponse = (response) => {
    setAuth(response.access_token)
  }

  let client = google.accounts.oauth2.initTokenClient({
    scope: 'https://www.googleapis.com/auth/youtube.readonly',
    client_id: '502719142670-nmd9g7usol96fs03av7aq7el692ov8is.apps.googleusercontent.com',
    ux_mode: 'popup',
    callback: handleCallbackResponse,
  })
  const doAuth = () => {
    const getCode = () => {
      client.requestAccessToken()
    }
    getCode()
  }
  const getSubscriptions = () => {
    axios.get(`https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=200&access_token=${auth}`)
      .then((data) => {
        let resourceIds = data.data.items.map((item) => {
          return item.snippet.resourceId
        })
        console.log(data.data)
        Promise.all(data.data.items.map((item) => {
          let id = item.snippet.resourceId.channelId
          return axios.get(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet&part=statistics&part=topicDetails&id=${id}&key=AIzaSyCeiswJk0KAIrpF6mgJjYKAb0lH_wF9eR0`)
        })).then((all) => {
          const subs = all.map((item, index) => {
            let results = item.data.items[0]
            results.snippet.resourceId = resourceIds[index]
            return item.data.items[0]
          })
          console.log(subs)
          setSubs(prev => subs)
        })
      }).catch((error) => {
        console.log(error)
      })
  }
  const testGetSUBS = () => {
    let addedChannels = [...subs]

    for (let i = 0; i < addedChannels.length; i++) {
      let id = addedChannels[i].snippet.resourceId.channelId
      const oldEntry = { ...addedChannels[i] }
      axios.get(`https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet&channelId=${id}&maxResults=200&key=AIzaSyCeiswJk0KAIrpF6mgJjYKAb0lH_wF9eR0`)
        .then((data) => {
          Promise.all(data.data.items.map(item => {
            let id = item.snippet.resourceId.channelId
            return axios.get(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet&part=statistics&part=topicDetails&id=${id}&key=AIzaSyCeiswJk0KAIrpF6mgJjYKAb0lH_wF9eR0`)
          })).then((all) => {
            const subsWithStatsandCat = all.map(item => {
              return item.data.items[0]
            })
            addedChannels.splice(i, 1, { ...oldEntry, subscriptions: subsWithStatsandCat })
          })
        }).catch(() => {
          addedChannels.splice(i, 1, { ...oldEntry })
        })
    }
    setTimeout(() => {
      reSetSubs(addedChannels)
    }, 2000)
  }

  const testGetReccomends = () => {
    let addedChannels = [...subs]

    const channelIds = subs.map((item) => {
      return item.snippet.resourceId.channelId
    })

    Promise.all(channelIds.map(item => {
      return axios.get(`https://youtube.googleapis.com/youtube/v3/channelSections?part=snippet%2CcontentDetails&channelId=${item}&key=AIzaSyCeiswJk0KAIrpF6mgJjYKAb0lH_wF9eR0`)
    })).then((all) => {
      let x = 0
      for (let i = 0; i < all.length; i++) {
        let channels = all[i].data.items.find((item => item.contentDetails?.channels))?.contentDetails?.channels

        if (channels) {
          // addedChannels.findIndex((ind) => ind.snippet.resourceId.channelId === all[i].data.items)
          const oldEntry = { ...addedChannels[x] }
          addedChannels.splice(x, 1)
          Promise.all(channels.map((item) => {
            return axios.get(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet&part=statistics&part=topicDetails&id=${item}&key=AIzaSyCeiswJk0KAIrpF6mgJjYKAb0lH_wF9eR0`)
          })).then((reccomendedChannels) => {
            reccomendedChannels = reccomendedChannels.map((item) => {
              return item.data.items[0]
            })
            addedChannels.push({ ...oldEntry, channels: reccomendedChannels })
          })
        } else {
          x++
        }
      }
      setTimeout(() => {
        reSetSubs(addedChannels)
      }, 2000)
    })
  }
  const reSetSubs = (addedChannels) => {
    setSubs([...addedChannels])
  }

  const getAllReccomended = () => {
    let subscriptions = subs.filter(item => item.subscriptions).map((item) => {
      item.subscriptions.map((chnl) => chnl.snippet.from = item.snippet.title)
      return [...item.subscriptions]
    })
    let channels = subs.filter(item => item.channels).map((item) => {
      item.channels.map((chnl) => chnl.snippet.from = item.snippet.title)
      return [...item.channels]
    })
    setReccomendeded([].concat(...subscriptions, ...channels))
  }

  const orderBySubs = () => {
    setReccomendeded(prev => {
      return [...prev.sort((a, b) => b.statistics.subscriberCount - a.statistics.subscriberCount)]
    })
  }
  const orderByCount = () => {
    setReccomendeded(prev => {
      let count = {}
      for (let i = 0; i < prev.length; i++) {
        let title = prev[i].snippet.title
        count[title] = (count[title] || 0) + 1
        if (count[title] > 1) {
          let index = prev.findIndex(item => item.snippet.title === title)
          prev[index].count = count[title]
          prev.splice(i, 1)
        }
      }
      return [...prev.sort((a, b) => (b?.count || 0) - (a?.count || 0))]
    })
  }
  return (
    <div className="App">
      hello
      <div>
        <button onClick={doAuth}>AUTH</button>
        <button onClick={getSubscriptions}>SUBS</button>
        <button onClick={testGetReccomends}>RECCO</button>
        <button onClick={testGetSUBS}>TESTSUBS</button>
        <button onClick={getAllReccomended}>GET ALL RECCOMENDED</button>
        <button onClick={orderBySubs}>ORDER BY SUBCOUNT </button>
        <button onClick={orderByCount}>ORDER BY COUNT </button>
        <button onClick={() => console.log(subs, reccomended)}>print subs</button>
      </div>

      <div>
        <div style={{ display: 'flex', width: '800px', flexWrap: 'wrap', flexDirection: 'row-reverse' }}>
          {reccomended && reccomended.map(item => {
            return (
              <div style={{ width: '120px', height: '70px', marginTop: '220px', marginLeft: '120px' }}>
                {item.snippet.title} {item.statistics.subscriberCount > 1000000 ? item.statistics.subscriberCount / 1000000 + 'M' : item.statistics.subscriberCount / 1000 + 'K'} {item?.count}
                <img src={item.snippet.thumbnails.default.url} alt='' />
                {(item?.topicDetails?.topicIds || []).map((element) => {
                  let topic = topics.find((l) => l.id === element)
                  return (
                    <span>{topic?.topic}</span>
                  )
                })}
              </div>
            )
          })}
        </div>
        <ul>
          {subs && subs.map((item, index) => {
            return (
              <li key={item.id + index}><h2>
                {item.snippet.title}  {item.statistics.subscriberCount > 1000000 ? item.statistics.subscriberCount / 1000000 + 'M' : item.statistics.subscriberCount / 1000 + 'K'}
              </h2>
                {item.topicDetails.topicIds.map((item) => {
                  let topic = topics.find((l) => l.id === item)
                  return (
                    <p>{topic.topic}</p>
                  )
                })}
                {item.channels && <h4>reccomendedChannels</h4>}
                {item.channels && item.channels.map((item, index) => (
                  <p key={item.id + index}><img src={item.snippet.thumbnails.default.url} alt='' />  {item.snippet.title} {item.statistics.subscriberCount > 1000000 ? item.statistics.subscriberCount / 1000000 + 'M' : item.statistics.subscriberCount / 1000 + 'K'}</p>
                ))}
                {item.subscriptions && <h4>Subscriptions</h4>}
                {item.subscriptions && item.subscriptions.map((item, index) => (
                  <p key={item.etag + index}><img src={item.snippet.thumbnails.default.url} alt='' />  {item.snippet.title}  {item.statistics.subscriberCount > 1000000 ? item.statistics.subscriberCount / 1000000 + 'M' : item.statistics.subscriberCount / 1000 + 'K'}</p>
                ))}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
