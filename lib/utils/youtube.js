var google = require('googleapis');
google.options({auth: config.youtube.apiKey});
var youtube = google.youtube('v3');

// Search Youtube -- callback is called on each found item
exports.searchYoutube = function (query, callback) {
    youtube.search.list(
        {
            part: 'snippet',
            type: 'video',
            q: query,
            maxResults: 50,
            order: 'date',
            safeSearch: 'moderate',
            videoEmbeddable: true
        },
        function (err, res) {
            if (err) {
                return callback(err);
            }
            res.items.forEach(function (result) {
                var video = {
                    id: result.id.videoId,
                    urlShort: 'http://youtu.be/' + result.id.videoId,
                    urlLong: 'http://www.youtube.com/watch?v=' + result.id.videoId,
                    published: result.snippet.publishedAt,
                    title: result.snippet.title || '',
                    description: result.snippet.description || '',
                    images: result.snippet.thumbnails,
                    channelTitle: result.snippet.channelTitle,
                    channelId: result.snippet.channelId,
                    live: result.snippet.liveBroadcastContent || ''
                };

                youtube.videos.list(
                    {
                        part: 'contentDetails',
                        id: video.id
                    },
                    function (err2, data) {
                        if (err2) {
                            return callback(err2);
                        }
                        if (data.items.length >= 1) {
                            data.items[0].contentDetails.duration.replace(/PT(\d+)M(\d+)S/, function (t, m, s) {
                                video.duration = (parseInt(m) * 60) + parseInt(s);
                            });
                            video.definition = data.items[0].contentDetails.definition;
                            callback(null, video);
                        }
                    }
                );
            });
        }
    );
};