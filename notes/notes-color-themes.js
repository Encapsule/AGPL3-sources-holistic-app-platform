# Color Theme Notes

KDE Plasma desktop for Linux distributions has a nice theme manager. They have done a lot of work to define a grammar of colors in particular, and some labels for fonts that together form the basis of a highly competent theme system (IMHO).

Suggest we copy them. If not literally, then in spirit.

The analysis should be against some ideal of a common library of d2r2-wrapped (or just plain-old) React components that use this common grammar to resolve color and font choices at runtime.

## KDE Plama Colors

_Taken from my local `~/.config/kdeglobal` file:`

```
[$Version]
update_info=fonts_global.upd:Fonts_Global

[Appmenu Style]
Style=InApplication

[ColorEffects:Disabled]
Color=
ColorAmount=
ColorEffect=
ContrastAmount=
ContrastEffect=
IntensityAmount=
IntensityEffect=

[ColorEffects:Inactive]
ChangeSelectionColor=true
Color=
ColorAmount=
ColorEffect=
ContrastAmount=
ContrastEffect=
Enable=false
IntensityAmount=
IntensityEffect=

[Colors:Button]
BackgroundAlternate=204,204,204
BackgroundNormal=220,220,220
DecorationFocus=10,153,209
DecorationHover=180,209,241
ForegroundActive=255,170,0
ForegroundInactive=128,128,128
ForegroundLink=0,0,255
ForegroundNegative=0,0,0
ForegroundNeutral=85,0,127
ForegroundNormal=48,48,48
ForegroundPositive=0,0,0
ForegroundVisited=69,40,134

[Colors:Complementary]
BackgroundAlternate=59,64,69
BackgroundNormal=208,245,128
DecorationFocus=30,146,255
DecorationHover=61,174,230
ForegroundActive=246,116,0
ForegroundInactive=175,176,179
ForegroundLink=61,174,230
ForegroundNegative=237,21,21
ForegroundNeutral=201,206,59
ForegroundNormal=85,170,255
ForegroundPositive=17,209,22
ForegroundVisited=61,174,230

[Colors:Selection]
BackgroundAlternate=71,164,34
BackgroundNormal=112,180,227
DecorationFocus=10,153,209
DecorationHover=180,209,241
ForegroundActive=255,170,0
ForegroundInactive=0,0,0
ForegroundLink=0,0,255
ForegroundNegative=0,0,0
ForegroundNeutral=85,0,127
ForegroundNormal=0,0,127
ForegroundPositive=0,0,0
ForegroundVisited=69,40,134

[Colors:Tooltip]
BackgroundAlternate=128,139,120
BackgroundNormal=156,175,192
DecorationFocus=10,153,209
DecorationHover=180,209,241
ForegroundActive=255,170,0
ForegroundInactive=128,128,128
ForegroundLink=0,0,255
ForegroundNegative=0,0,0
ForegroundNeutral=85,0,127
ForegroundNormal=10,31,31
ForegroundPositive=0,0,0
ForegroundVisited=69,40,134

[Colors:View]
BackgroundAlternate=210,210,210
BackgroundNormal=255,255,255
DecorationFocus=10,153,209
DecorationHover=180,209,241
ForegroundActive=255,170,0
ForegroundInactive=128,128,128
ForegroundLink=0,0,255
ForegroundNegative=0,0,0
ForegroundNeutral=85,0,127
ForegroundNormal=48,48,48
ForegroundPositive=0,0,0
ForegroundVisited=69,40,134

[Colors:Window]
BackgroundAlternate=178,178,178
BackgroundNormal=195,195,195
DecorationFocus=10,153,209
DecorationHover=180,209,241
ForegroundActive=255,170,0
ForegroundInactive=128,128,128
ForegroundLink=0,0,255
ForegroundNegative=0,0,0
ForegroundNeutral=85,0,127
ForegroundNormal=48,48,48
ForegroundPositive=0,0,0
ForegroundVisited=69,40,134

[DesktopIcons]
ActiveColor=169,156,255
ActiveColor2=0,0,0
ActiveEffect=togamma
ActiveSemiTransparent=false
ActiveValue=0.699999988079071
Animated=true
DefaultColor=144,128,248
DefaultColor2=0,0,0
DefaultEffect=none
DefaultSemiTransparent=false
DefaultValue=1
DisabledColor=34,202,0
DisabledColor2=0,0,0
DisabledEffect=togray
DisabledSemiTransparent=true
DisabledValue=1
Size=48

[DialogIcons]
ActiveColor=169,156,255
ActiveColor2=0,0,0
ActiveEffect=none
ActiveSemiTransparent=false
ActiveValue=1
Animated=false
DefaultColor=144,128,248
DefaultColor2=0,0,0
DefaultEffect=none
DefaultSemiTransparent=false
DefaultValue=1
DisabledColor=34,202,0
DisabledColor2=0,0,0
DisabledEffect=togray
DisabledSemiTransparent=true
DisabledValue=1
Size=32

[General]
BrowserApplication=google-chrome.desktop
ColorScheme=beach-surf - cdr
Name=Breeze
UseSystemBell=true
XftAntialias=true
fixed=Source Code Pro Semibold,9,-1,5,63,0,0,0,0,0
font=Play,8,-1,5,50,0,0,0,0,0
menuFont=Audiowide,10,-1,5,50,0,0,0,0,0
shadeSortColumn=true
smallestReadableFont=Audiowide,8,-1,5,50,0,0,0,0,0
toolBarFont=Audiowide,9,-1,5,50,0,0,0,0,0
widgetStyle=Breeze

[Icons]
Theme=breeze

[KDE]
ColorScheme=Breeze
DoubleClickInterval=400
LookAndFeelPackage=org.kde.breeze.desktop
ShowIconsInMenuItems=true
ShowIconsOnPushButtons=true
SingleClick=true
StartDragDist=4
StartDragTime=500
WheelScrollLines=10
contrast=4
widgetStyle=fusion

[KFileDialog Settings]
Automatically select filename extension=true
Breadcrumb Navigation=true
Decoration position=0
LocationCombo Completionmode=5
PathCombo Completionmode=5
Previews=true
Show Bookmarks=false
Show Full Path=false
Show Preview=false
Show Speedbar=true
Show hidden files=false
Sort by=Name
Sort directories first=true
Sort reversed=false
Speedbar Width=130
View Style=Simple
listViewIconSize=48

[KShortcutsDialog Settings]
Dialog Size=600,480

[MainToolbarIcons]
ActiveColor=169,156,255
ActiveColor2=0,0,0
ActiveEffect=none
ActiveSemiTransparent=false
ActiveValue=1
Animated=false
DefaultColor=144,128,248
DefaultColor2=0,0,0
DefaultEffect=none
DefaultSemiTransparent=false
DefaultValue=1
DisabledColor=34,202,0
DisabledColor2=0,0,0
DisabledEffect=togray
DisabledSemiTransparent=true
DisabledValue=1
Size=22

[PanelIcons]
ActiveColor=169,156,255
ActiveColor2=0,0,0
ActiveEffect=togamma
ActiveSemiTransparent=false
ActiveValue=0.699999988079071
Animated=false
DefaultColor=144,128,248
DefaultColor2=0,0,0
DefaultEffect=none
DefaultSemiTransparent=false
DefaultValue=1
DisabledColor=34,202,0
DisabledColor2=0,0,0
DisabledEffect=togray
DisabledSemiTransparent=true
DisabledValue=1
Size=32

[SmallIcons]
ActiveColor=169,156,255
ActiveColor2=0,0,0
ActiveEffect=none
ActiveSemiTransparent=false
ActiveValue=1
Animated=false
DefaultColor=144,128,248
DefaultColor2=0,0,0
DefaultEffect=none
DefaultSemiTransparent=false
DefaultValue=1
DisabledColor=34,202,0
DisabledColor2=0,0,0
DisabledEffect=togray
DisabledSemiTransparent=true
DisabledValue=1
Size=16

[Toolbar style]
ToolButtonStyle=TextBesideIcon
ToolButtonStyleOtherToolbars=TextBesideIcon

[ToolbarIcons]
ActiveColor=169,156,255
ActiveColor2=0,0,0
ActiveEffect=none
ActiveSemiTransparent=false
ActiveValue=1
Animated=false
DefaultColor=144,128,248
DefaultColor2=0,0,0
DefaultEffect=none
DefaultSemiTransparent=false
DefaultValue=1
DisabledColor=34,202,0
DisabledColor2=0,0,0
DisabledEffect=togray
DisabledSemiTransparent=true
DisabledValue=1
Size=22

[WM]
activeBackground=2,139,194
activeBlend=174,191,207
activeFont=Audiowide,14,-1,5,50,0,0,0,0,0
activeForeground=255,255,255
inactiveBackground=0,93,127
inactiveBlend=176,193,209
inactiveForeground=0,165,213

```
