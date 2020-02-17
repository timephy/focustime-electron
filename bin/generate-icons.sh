# npm install svgexport -g
rm -rf icons
mkdir -p icons

# win
mkdir -p icons/win
svgexport svg/icon.svg icons/win/icon.png
convert icons/win/icon.png -resize 256x256 icons/win/icon.ico

# mac
# mkdir -p icons/mac
mkdir -p icons/mac/AppIcon.iconset
svgexport svg/icon.svg icons/mac/AppIcon.iconset/icon_16x16.png 16:16
svgexport svg/icon.svg icons/mac/AppIcon.iconset/icon_16x16@2x.png 32:32
svgexport svg/icon.svg icons/mac/AppIcon.iconset/icon_32x32.png 32:32
svgexport svg/icon.svg icons/mac/AppIcon.iconset/icon_32x32@2x.png 64:64
svgexport svg/icon.svg icons/mac/AppIcon.iconset/icon_128x128.png 128:128
svgexport svg/icon.svg icons/mac/AppIcon.iconset/icon_128x128@2x.png 256:256
svgexport svg/icon.svg icons/mac/AppIcon.iconset/icon_256x256.png 256:256
svgexport svg/icon.svg icons/mac/AppIcon.iconset/icon_256x256@2x.png 512:512
svgexport svg/icon.svg icons/mac/AppIcon.iconset/icon_512x512.png 512:512
svgexport svg/icon.svg icons/mac/AppIcon.iconset/icon_512x512@2x.png 1024:1024

iconutil -c icns --output icons/mac/icon.icns icons/mac/AppIcon.iconset
