const axios = require("axios");

const getScore = async (text, topics) => {
  let spellingScore, grammerScore, relevanceScore;
  await axios
    .post(
      "https://gi3domjqhj3gk4ttnfxw4lzrfyydu3lpmnvwk4roobzgs43nfz4w23a.prism.stoplight.io/evaluate/spellings",
      {
        text: text
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
    .then(response => {
      spellingScore = response.data.score;
    });
  await axios
    .post(
      "https://gi3domjqhj3gk4ttnfxw4lzrfyydu3lpmnvwk4roobzgs43nfz4w23a.prism.stoplight.io/evaluate/grammar",
      {
        text: text
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
    .then(response => {
      grammerScore = response.data.score;
    });
  await axios
    .post(
      "https://gi3domjqhj3gk4ttnfxw4lzrfyydu3lpmnvwk4roobzgs43nfz4w23a.prism.stoplight.io/evaluate/relevance",
      {
        text: text,
        topics: topics
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
    .then(response => {
      relevanceScore = response.data.score;
    });
  return new Promise((resolve, reject) => {
    resolve(
      JSON.stringify({
        spellingScore: spellingScore,
        grammerScore: grammerScore,
        relevanceScore: relevanceScore
      })
    );
  });
};

module.exports = { getScore };
