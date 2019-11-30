/**
 * Social Health Library
 */

/**
 * REGEX
 */


SH = {}
SH.accounts = ["twitter", 'facebook', 'linkedin', 'youtube', 'instagram', 'github']
SH.keyword = ['twitter', 'facebook', 'linkedin', 'youtube channel', 'instagram', 'github']

Regex = {
    twitter: /http(?:s)?:\/\/(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)/,
    facebook: /(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?([\w\-]*)?/,
    linkedin: /http(s)?:\/\/([\w]+\.)?linkedin\.com\/pub\/[A-z0-9_-]+(\/[A-z0-9]+){3}\/?/,
    youtube: /((http|https):\/\/|)(www\.|)youtube\.com\/(channel\/|user\/)[a-zA-Z0-9\-]{1,}/,
    instagram: /https?:\/\/(www\.)?instagram\.com\/([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)/,
    youtubeWatch: /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
}


Regex.txt = {}
Regex.txt.url = /(https?:\/\/[^ ]*)/;
Regex.txt.facebook = 'facebook'
Regex.txt.twitter = 'twitter.com'
Regex.txt.instagram = 'instagram.com'
Regex.txt.youtube = 'youtube.com'
Regex.txt.linkedin = 'linkedin'
Regex.txt.github = 'github'





module.exports = Regex;
module.exports = SH;