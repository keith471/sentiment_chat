'''Sentiment analysis using Vader model'''
from __future__ import print_function

from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk.tokenize import word_tokenize
from nltk import tokenize
import fileinput
import zerorpc

class SentimentAnalyzer(object):

    def __init__(self):
        self.sid = SentimentIntensityAnalyzer()

    def process_text(self, text):
        sents = tokenize.sent_tokenize(text)
        return sents

    def get_sentiment(self, text):
        '''returns number between -1 and 1 based on overall sentiment'''
        sents = self.process_text(text)
        total = 0.0
        count = 0
        for s in sents:
            scores = self.sid.polarity_scores(s)
            for k in sorted(scores):
                print('{0}: {1}, '.format(k, scores[k]), end='')
            print()
            total += scores['compound']
            count += 1
        return total / float(count)

class Server(object):
    def analyze_sentiment(self, text):
        sa = SentimentAnalyzer()
        return sa.get_sentiment(text)

s = zerorpc.Server(Server())
s.bind("tcp://0.0.0.0:4242")
s.run()
