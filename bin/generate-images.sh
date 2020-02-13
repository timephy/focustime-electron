# npm install svgexport -g
rm -rf images
mkdir -p images

svgexport svg/icon.svg images/icon.png
svgexport svg/symbol.svg images/symbolTemplate.png 16:16
svgexport svg/symbol.svg images/symbolTemplate@2x.png 32:32
svgexport svg/symbol-play.svg images/symbol-playTemplate.png 16:16
svgexport svg/symbol-play.svg images/symbol-playTemplate@2x.png 32:32
svgexport svg/symbol-pause.svg images/symbol-pauseTemplate.png 16:16
svgexport svg/symbol-pause.svg images/symbol-pauseTemplate@2x.png 32:32
