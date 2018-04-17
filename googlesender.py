try:
    import urllib.request as urllib2
except ImportError:
    import urllib2
import re, json, sys

def idfromurl(url):
    m = re.match('https?://docs.google.com/forms/d/e/(.{16}[^/]*)/viewform', url)
    return m and m.group(1)

# Scrape the Google Form.
html = urllib2.urlopen('https://docs.google.com/forms/d/e/1FAIpQLSeQKTQ9Ftrvm-wOO85Zz6QWB3aYYwzCbt9GQVf6BuQP1GNq7w/viewform').read()

# If it is a form authoring URL, then it contains a form submission url.
match = re.search(r'<meta itemprop="url" content="([^"]*)"', html)
if match and idfromurl(match.group(1)) != idfromurl('https://docs.google.com/forms/d/e/1FAIpQLSeQKTQ9Ftrvm-wOO85Zz6QWB3aYYwzCbt9GQVf6BuQP1GNq7w/viewform'):
    # So fetch that page instead.
    html = urllib2.urlopen(match.group(1)).read()

# Extract this special variable value.
match = re.search(
    r'FB_PUBLIC_LOAD_DATA_\s*=\s*(.*?);\s*</script>', html, re.DOTALL)

compressed = match.group(1)

# Fix up JSON-like by replacing ,, with , null,
jstext = re.sub(r'(?<=[,[])\s*,', 'null,', compressed)

# Decode JSON.
js = json.loads(jstext)

# Sometimes the imporant data is the whole array; other times it is
# wrapped as an array inside the first element.
if isinstance(js[0] ,list):
    js = js[0]

# Camel casing, for code generation.
def camel(n):
    names = re.sub(r'\W', ' ', n).split(' ')
    cameled = [names[0].lower()] + [n.title() for n in names[1:]]
    return ''.join(cameled)

# Extract form information from the JSON.
# Tested on 3/29/2016; revised on 1/27/2017 for updated format.
formid = js[14] or js[0]
formname = js[3] or js[1][0]
fname = camel('send ' + formname)
data = js[1][1]
args = [camel(d[1]) for d in data]
nums = [d[4][0][0] for d in data]

# Code generation.
print ('// ' + formname + ' submission function')
print ('// submits to the google form at this URL:')
print ('// ' + re.sub('^https?://', '', 'https://docs.google.com/forms/d/e/1FAIpQLSeQKTQ9Ftrvm-wOO85Zz6QWB3aYYwzCbt9GQVf6BuQP1GNq7w/viewform'))
print ('function ' + fname + '(\n    ' + ',\n    '.join(args) + ') {')
print ('  var formid = "' + formid + '";')
print ('  var data = {')
for j in range(len(data)):
    comma = (j + 1 < len(data) and ',' or '')
    print ('    "entry.' + str(nums[j]) + '": ' + args[j] + comma)
print ('  };')
print ('  var params = [];')
print ('  for (key in data) {')
print ('    params.push(key + "=" + encodeURIComponent(data[key]));')
print ('  }')
print ('  // Submit the form using an image to avoid CORS warnings.')
print ('  (new Image).src = "https://docs.google.com/forms/d/" + formid +')
print ('     "/formResponse?" + params.join("&");')
print ('}')