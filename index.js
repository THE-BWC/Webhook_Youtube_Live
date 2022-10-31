const fetch = require('node-fetch')
const axios = require('axios')
const { google } = require("googleapis");
const Winston = require('winston');
const { WebhookClient, EmbedBuilder } = require('discord.js');
const config = require('./config.json')


/**
 * Logger
 */
let logger = Winston.createLogger({
    transports: [
        new Winston.transports.File({ filename: 'Youtube-Live-Notification.log' })
    ],
    format: Winston.format.printf((log) => `[${new Date().toLocaleString()}] - [${log.level.toUpperCase()}] - ${log.message}`)
})

/**
 * Outputs to console during Development & loads dotenv
 */
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
    logger.add(new Winston.transports.Console({
        format: Winston.format.simple()
    }))
}

let streamerStatusCache = {}
const YoutubeURL = 'https://www.youtube.com/channel/'
const webhookClient = new WebhookClient({ url: process.env.WEBHOOK_URL })

const youtube = google.youtube({
    version: process.env.YOUTUBE_API_VERSION,
    auth: process.env.YOUTUBE_API_KEY
})

async function sendWebhookMessage(channel, videoInfo) {
    const data = videoInfo.data.items[0]
    const userName = data.snippet.channelTitle
    const YoutubeURL = `https://youtube.com/channel/${channel}/live`

    let embed = new EmbedBuilder()
        .setTitle(data.snippet.title)
        .setURL(YoutubeURL)
        .setColor([153, 26, 26])
        .setFooter({ text: 'BWC Youtube Notifications', iconURL: config.iconURL})
        .setAuthor({ name: `${userName} is now live on Youtube!`, url: `${YoutubeURL}`, iconURL: data.snippet.thumbnails.default.url })
        .setDescription(`[Watch Here](${YoutubeURL})`)
        .setImage(data.snippet.thumbnails.maxres.url)

    await webhookClient.send({
        content: config.message
            .replace('{streamer}', userName)
            .replace('{url}', channel),
        embeds: [embed]
    })
}

async function getLiveStream(channel) {
    let liveStream = []
    logger.info(`[${channel}] | Getting live video...`);
    const getURL = YoutubeURL + channel +'/videos?view=2&live_view=501'
    const response = await axios.get(getURL)

    let getData = response.data
    let liveVideoIDTag = 'var ytInitialData = '
    let position = getData.indexOf(liveVideoIDTag)
    let positionEnd = getData.indexOf('</script>', position)
    let gettingData = JSON.parse(getData.slice(position+20,positionEnd-1))
    let searchArray = gettingData.contents.twoColumnBrowseResultsRenderer.tabs[1].tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].gridRenderer.items

    for (let index = 0; index < searchArray.length; index++) {
        const element = searchArray[index];

        let findVideoId = element.gridVideoRenderer.videoId
        let findTitle = element.gridVideoRenderer.title.runs[0].text

        if(element.gridVideoRenderer.thumbnailOverlays[0].thumbnailOverlayTimeStatusRenderer.style === 'LIVE'){
            let findLiveStatus = 'live'
            liveStream.push({videoId: findVideoId, videoTitle: findTitle, liveStatus:findLiveStatus})
            logger.info(`[${channel}] | Live video found`);
        }
    }

    return liveStream
}

function check() {
    config.channels.forEach(async (channel) => {
        logger.info(`[${channel}] | Start checking...`);
        streamerStatusCache[channel] = { status: 0 }

        const response = await fetch(YoutubeURL + channel)
            .then(res => res.text())

        if (!response) {
            logger.error(`Response Empty: ${YoutubeURL+channel}`)
            return
        }

        const isLive = response.includes("hqdefault_live.jpg")

        if (isLive === true && streamerStatusCache[channel].status === 0) {
            logger.info(`[${channel}] | Streamer set to Online`);

            streamerStatusCache[channel].status = 1

            const video = await getLiveStream(channel)
            const videoInfo = await youtube.videos.list({
                part: ['snippet'],
                id: [video[0].videoId]
            })

            await sendWebhookMessage(channel, videoInfo)
            logger.info(`[${channel}] | Posted notification`);

        } else if (isLive === false && streamerStatusCache[channel].status === 1) {
            logger.info(`[${channel}] | Streamer set to Offline`);
            streamerStatusCache[channel].status = 0
        }
    })
    logger.info('[APP] Sleeping...')
}

check()
setInterval(check, 300 * 1000)
