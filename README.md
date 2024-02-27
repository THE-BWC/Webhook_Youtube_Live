# YouTube Live Webhook
A simple node.js application that monitors BWC Members' YouTube channels for live streams and posts them to a Discord channel using a webhook.

## Requirements
- Node.js (https://nodejs.org/en/download/) (v16.9.0 or higher)
- NPM (https://www.npmjs.com/get-npm) (should be installed with Node.js)
- PM2 (https://pm2.keymetrics.io/docs/usage/quick-start/) (Optional) - Used to run the application as a service.
- A Discord channel with a webhook.
- A list of BWC Members' YouTube channel IDs.

## Installation
### Run in terminal
1. Download the latest release from the releases page.
2. Extract the zip file to a directory of your choice.
3. Open a terminal window and navigate to the directory where you extracted the zip file.
4. Run `npm install` to install the required dependencies.
5. Run `npm run start` to start the application.
6. The application will now be running in the terminal window. You can close the terminal window if you wish.
7. To stop the application, press `CTRL + C` in the terminal window.

### Run as a service
1. Download the latest release from the releases page.
2. Extract the zip file to a directory of your choice.
3. Open a terminal window and navigate to the directory where you extracted the zip file.
4. Run `npm install` to install the required dependencies.
5. Run `pm2 start ecosystem.config.json` to start the application as a service. You can then use `pm2 stop <name>/<id>` to stop the application, and `pm2 restart name>/<id>` to restart the application.
6. If you wish to run the application as a service on startup, you can use PM2 to do so. Run `pm2 startup` to generate the startup command for your system. Then run the command that was generated to enable PM2 to run on startup. Then run `pm2 save` to save the current PM2 configuration. You can then use `pm2 stop name>/<id>` to stop the application, and `pm2 restart name>/<id>` to restart the application.

## Configuration
### config.json
1. Open the `config.json` file in a text editor.
2. Replace the `iconURL` value with the URL of the icon you wish to use for the embeds.
3. Replace the `message` value with the message you want to be sent to the Discord channel.
4. Add the members channel id to the `Youtubers` array.
5. Save the `config.json` file.

### ecosystem.config.json
1. Open the ecosystem.config.json file in a text editor.
2. Add your YouTube API key to the `YOUTUBE_API_KEY` value.
3. Add the webhook url to the `WEBHOOK_URL` value.
4. Save the `ecosystem.config.json` file.

### Note
- The `message` value supports Discord markdown.
- You can find a member's channel id by going to their channel and copying the last part of the URL. For example, the channel id for https://www.youtube.com/channel/UC0ZV6bqO9oBSvvXWvqsYeNw is `UC0ZV6bqO9oBSvvXWvqsYeNw`. You can add multiple channel ids to the array. The application will monitor all of the channels in the array. If the channel id is not in the url, you will have to find it using a tool such as https://commentpicker.com/youtube-channel-id.php.

## Logging
The application uses the `winston` logger to log messages to the console and to a log file. The log file is named `Youtube-API-Discord.log`.

## Contributing
1. Fork the repository.
2. Create a new branch for your changes.
3. Make your changes.
4. Create a pull request.
5. Enjoy!

## Contact
If you have any questions, feel free to contact me on:
- [BWC Discord](https://discord.the-bwc.com/) `[BWC] Patrick`
- [BWC Forums](https://the-bwc.com/forum/index.php) `Patrick`.

## Credits
- [Black Widow Company](https://www.the-bwc.com) - Development
- [Node.js](https://nodejs.org/en/) - Application Development
- [NPM](https://www.npmjs.com/) - Package Management
- [PM2](https://pm2.keymetrics.io/) - Process Management
- [Winston](https://github.com/winstonjs/winston) - Logging Library
- [Discord.js](https://discord.js.org/) - Discord API Library
- [YouTube API](https://developers.google.com/youtube/v3) - YouTube API
